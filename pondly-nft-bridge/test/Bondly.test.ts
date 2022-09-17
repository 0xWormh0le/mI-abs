import * as fc from "fast-check";
import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { keccak256 } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  BondlyBridgeChild,
  BondlyBridgeChild__factory,
  BondlyBridgeHub,
  BondlyBridgeHub__factory,
  DiscountManager,
  DiscountManager__factory,
  Mock1155,
  Mock1155__factory,
  Mock721,
  Mock721__factory,
} from "../types";
import {
  merkleRoot,
  depositBytes,
  claimNativeTokenProof,
  claimForeignTokenProof,
} from "./helpers";
import { cardanoAddress, byte32 } from "./arbitraries";

type Context = {
  mock1155: Mock1155;
  mock721: Mock721;
  bridgeHub: BondlyBridgeHub;
  bridgeChild: BondlyBridgeChild;
  signers: SignerWithAddress[];
  discountManager: DiscountManager;
  treasury: SignerWithAddress;
  flatFee: number;
};

describe("BondlyBridge", () => {
  const context: Context = {} as Context;

  beforeEach(async () => {
    const Mock721 = (await ethers.getContractFactory(
      "Mock721"
    )) as Mock721__factory;
    const Mock1155 = (await ethers.getContractFactory(
      "Mock1155"
    )) as Mock1155__factory;
    const BondlyBridgeHub = (await ethers.getContractFactory(
      "BondlyBridgeHub"
    )) as BondlyBridgeHub__factory;
    const BondlyBridgeChild = (await ethers.getContractFactory(
      "BondlyBridgeChild"
    )) as BondlyBridgeChild__factory;
    const DiscountManager = (await ethers.getContractFactory(
      "DiscountManager"
    )) as DiscountManager__factory;

    const signers = await ethers.getSigners();
    const mock721 = await Mock721.deploy();
    const mock1155 = await Mock1155.deploy();

    const treasury = signers[3];
    const flatFee = 1000;
    const discountManager = await DiscountManager.deploy(
      treasury.address,
      flatFee
    );

    const [alice] = signers;
    mock721.connect(alice).mint(alice.address, 1, "721-token-1-uri");
    mock1155.connect(alice).mint(alice.address, 1, 5, "1155-token-1-uri");
    mock1155.connect(alice).mint(alice.address, 2, 5, "1155-token-2-uri");

    const whitelist = merkleRoot(keccak256(mock721.address), [
      keccak256(mock1155.address),
    ]);
    const bridgeHub = await BondlyBridgeHub.deploy(
      whitelist,
      discountManager.address,
      alice.address
    );
    const bridgeChild = await BondlyBridgeChild.deploy(bridgeHub.address);

    await bridgeHub.connect(alice).setChildImplementation(bridgeChild.address);

    context.signers = signers;
    context.mock721 = mock721;
    context.mock1155 = mock1155;
    context.bridgeHub = bridgeHub;
    context.bridgeChild = bridgeChild;
    context.discountManager = discountManager;
    context.flatFee = flatFee;
    context.treasury = treasury;
  });

  describe("sendNativeToken", () => {
    it("fails: batch 1155 deposit is not allowed", async () => {
      const {
        mock721,
        mock1155,
        bridgeHub,
        signers: [alice],
      } = context;

      await fc.assert(
        fc.asyncProperty(
          fc
            .string({ minLength: 5 })
            .map((recipient) =>
              depositBytes([keccak256(mock721.address)], recipient)
            ),
          async (depositData) => {
            await expect(
              mock1155
                .connect(alice)
                .safeBatchTransferFrom(
                  alice.address,
                  bridgeHub.address,
                  [1, 2],
                  [2, 2],
                  depositData
                )
            ).to.revertedWith("Bondly: batch deposit not allowed");
          }
        )
      );
    });

    it("fails: token is not whitelisted", async () => {
      const {
        bridgeHub,
        mock1155,
        signers: [alice],
      } = context;

      const Mock721 = (await ethers.getContractFactory(
        "Mock721"
      )) as Mock721__factory;

      const depositData = depositBytes(
        [keccak256(mock1155.address)],
        "some address"
      );

      await fc.assert(
        fc.asyncProperty(fc.integer(), async () => {
          const invalidToken = await Mock721.deploy();
          await invalidToken
            .connect(alice)
            .mint(alice.address, 1, "meaningless uri");
          await expect(
            invalidToken
              .connect(alice)
              ["safeTransferFrom(address,address,uint256,bytes)"](
                alice.address,
                bridgeHub.address,
                1,
                depositData
              )
          ).to.revertedWith("Bondly: token not whitelisted");
        })
      );
    });

    it("fails: recipient is not valid cardano address", async () => {
      const {
        mock721,
        mock1155,
        bridgeHub,
        signers: [alice],
      } = context;

      await fc.assert(
        fc.asyncProperty(
          fc
            .string({ minLength: 5 })
            .map((invalidRecipientAddress) =>
              depositBytes(
                [keccak256(mock1155.address)],
                invalidRecipientAddress
              )
            ),
          async (depositData) => {
            await expect(
              mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  1,
                  depositData
                )
            ).to.revertedWith("Bondly: invalid recipient addr");
          }
        )
      );
    });

    it("success: 721 deposit", async () => {
      const {
        mock721,
        mock1155,
        bridgeHub,
        flatFee,
        treasury,
        signers: [alice],
      } = context;

      const mock721name = await mock721.name();
      let tokenId = 1;
      let depositId = 0;

      await fc.assert(
        fc.asyncProperty(
          fc.string(),
          cardanoAddress(),
          async (uri, recipient) => {
            tokenId += 1;
            await mock721.connect(alice).mint(alice.address, tokenId, uri);
            await expect(
              mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  depositBytes([keccak256(mock1155.address)], recipient)
                )
            )
              .to.emit(bridgeHub, "NativeTokenDeposited")
              .withArgs(
                alice.address,
                depositId, // deposit id
                mock721.address,
                tokenId,
                1, // amount
                recipient
              );

            depositId += 1;

            await expect(
              bridgeHub.connect(alice).sendNativeToken(
                depositId, // deposit id
                0 // discount id
              )
            ).to.revertedWith("Bondly: invalid deposit id");

            await expect(
              bridgeHub.connect(alice).sendNativeToken(
                depositId - 1, // deposit id,
                0, // discount id
                { value: 99 }
              )
            ).to.revertedWith("Bondly: fee amount not match");

            const balance = await bridgeHub.feeBalance();
            await expect(
              bridgeHub.connect(alice).sendNativeToken(
                depositId - 1, // deposit id,
                0, // discount id
                { value: flatFee }
              )
            )
              .to.emit(bridgeHub, "SendNativeToken")
              .withArgs(
                recipient,
                mock721.address,
                mock721name,
                tokenId,
                1, // amount
                uri
              );

            // check fee balance
            expect(balance.add(flatFee).toHexString()).to.equal(
              (await bridgeHub.feeBalance()).toHexString()
            );

            // check fee withdraw
            const treasuryBalance = await treasury.getBalance();
            const feeBalance = await bridgeHub.feeBalance();

            await expect(bridgeHub.connect(alice).withdrawFee()).to.emit(
              bridgeHub,
              "FeeWithdrawn"
            );

            expect(treasuryBalance.add(feeBalance).toHexString()).to.equal(
              (await treasury.getBalance()).toHexString()
            );

            expect((await bridgeHub.feeBalance()).toNumber()).to.equal(0);
          }
        )
      );
    });

    it("success: 1155 deposit", async () => {
      const {
        mock721,
        mock1155,
        bridgeHub,
        flatFee,
        signers: [alice],
      } = context;

      let depositId = 0;

      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2 }),
          fc.integer({ min: 2 }),
          fc.string(),
          cardanoAddress(),
          async (tokenId, amount, uri, recipient) => {
            await mock1155
              .connect(alice)
              .mint(alice.address, tokenId, amount, uri);
            await expect(
              mock1155
                .connect(alice)
                .safeTransferFrom(
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  amount,
                  depositBytes([keccak256(mock721.address)], recipient)
                )
            ).to.emit(bridgeHub, "NativeTokenDeposited");

            depositId += 1;

            await expect(
              bridgeHub.connect(alice).sendNativeToken(
                depositId - 1, // deposit id,
                0, // discount id
                { value: flatFee }
              )
            ).to.emit(bridgeHub, "SendNativeToken");
          }
        )
      );
    });
  });

  describe("claimNativeToken", () => {
    describe("erc721", async () => {
      it("fails: failed to verify proof", async () => {
        const {
          mock721,
          mock1155,
          bridgeHub,
          signers: [alice, bob],
        } = context;

        let tokenId = 1;

        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            cardanoAddress(),
            async (uri, cardanoRecipient) => {
              tokenId += 1;
              await mock721.connect(alice).mint(alice.address, tokenId, uri);
              await mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  depositBytes([keccak256(mock1155.address)], cardanoRecipient)
                );

              const { proof, key } = claimNativeTokenProof(
                bob.address,
                mock721.address,
                tokenId,
                1,
                0
              );

              // fails to verify proof
              await expect(
                bridgeHub
                  .connect(alice)
                  .claimNativeToken(
                    bob.address,
                    mock721.address,
                    tokenId,
                    2,
                    key,
                    proof
                  )
              ).to.revertedWith("Bondly: failed to verify proof");
            }
          )
        );
      });

      it("fails: amount is not 1 when claiming native 721", async () => {
        const {
          mock721,
          mock1155,
          bridgeHub,
          signers: [alice, bob],
        } = context;

        let tokenId = 1;

        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            cardanoAddress(),
            async (uri, cardanoRecipient) => {
              tokenId += 1;
              await mock721.connect(alice).mint(alice.address, tokenId, uri);
              await mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  depositBytes([keccak256(mock1155.address)], cardanoRecipient)
                );

              // fails: amount is not 1 when claiming native 721

              const { proof: proof2, key: key2 } = claimNativeTokenProof(
                bob.address,
                mock721.address,
                tokenId,
                2,
                0
              );

              await expect(
                bridgeHub
                  .connect(alice)
                  .claimNativeToken(
                    bob.address,
                    mock721.address,
                    tokenId,
                    2,
                    key2,
                    proof2
                  )
              ).to.revertedWith("Bondly: invalid amount");
            }
          )
        );
      });

      it("success", async () => {
        const {
          mock721,
          mock1155,
          bridgeHub,
          signers: [alice, bob],
        } = context;

        let tokenId = 1;

        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            cardanoAddress(),
            async (uri, cardanoRecipient) => {
              tokenId += 1;
              await mock721.connect(alice).mint(alice.address, tokenId, uri);
              await mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  depositBytes([keccak256(mock1155.address)], cardanoRecipient)
                );

              const { proof, key } = claimNativeTokenProof(
                bob.address,
                mock721.address,
                tokenId,
                1,
                0
              );

              // claim succeess
              await expect(
                bridgeHub
                  .connect(alice)
                  .claimNativeToken(
                    bob.address,
                    mock721.address,
                    tokenId,
                    1,
                    key,
                    proof
                  )
              )
                .to.emit(bridgeHub, "Claim")
                .withArgs(bob.address, mock721.address, tokenId, 1);
            }
          )
        );
      });

      it("fails: reclaim using the same proof", async () => {
        const {
          mock721,
          mock1155,
          bridgeHub,
          signers: [alice, bob],
        } = context;

        let tokenId = 1;

        await fc.assert(
          fc.asyncProperty(
            fc.string(),
            cardanoAddress(),
            async (uri, cardanoRecipient) => {
              tokenId += 1;
              await mock721.connect(alice).mint(alice.address, tokenId, uri);
              await mock721
                .connect(alice)
                ["safeTransferFrom(address,address,uint256,bytes)"](
                  alice.address,
                  bridgeHub.address,
                  tokenId,
                  depositBytes([keccak256(mock1155.address)], cardanoRecipient)
                );

              const { proof, key } = claimNativeTokenProof(
                bob.address,
                mock721.address,
                tokenId,
                1,
                0
              );

              // claim succeess
              await expect(
                bridgeHub
                  .connect(alice)
                  .claimNativeToken(
                    bob.address,
                    mock721.address,
                    tokenId,
                    1,
                    key,
                    proof
                  )
              )
                .to.emit(bridgeHub, "Claim")
                .withArgs(bob.address, mock721.address, tokenId, 1);

              // fails: reclaim using the same proof
              await expect(
                bridgeHub
                  .connect(alice)
                  .claimNativeToken(
                    bob.address,
                    mock721.address,
                    tokenId,
                    2,
                    key,
                    proof
                  )
              ).to.revertedWith("Bondly: already claimed");
            }
          )
        );
      });
    });

    it("erc1155", async () => {
      const {
        mock721,
        mock1155,
        bridgeHub,
        signers: [alice, bob],
      } = context;

      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1 }),
          fc.string(),
          cardanoAddress(),
          async (tokenId, uri, cardanoRecipient) => {
            tokenId += 1;
            const { proof, key } = claimNativeTokenProof(
              bob.address,
              mock1155.address,
              tokenId,
              1,
              0
            );
            await mock1155.connect(alice).mint(alice.address, tokenId, 1, uri);
            await mock1155
              .connect(alice)
              .safeTransferFrom(
                alice.address,
                bridgeHub.address,
                tokenId,
                1,
                depositBytes([keccak256(mock721.address)], cardanoRecipient)
              );
            await expect(
              bridgeHub
                .connect(alice)
                .claimNativeToken(
                  bob.address,
                  mock1155.address,
                  tokenId,
                  1,
                  key,
                  proof
                )
            )
              .to.emit(bridgeHub, "Claim")
              .withArgs(bob.address, mock1155.address, tokenId, 1);
          }
        )
      );
    });
  });

  it("claimForeignToken", async () => {
    const {
      bridgeHub,
      bridgeChild,
      signers: [alice, bob],
    } = context;

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0 }),
        fc.integer({ min: 1 }),
        fc.string(),
        byte32(),
        async (currencySymbol, amount, uri, tokenName) => {
          const { proof, key } = claimForeignTokenProof(
            alice.address,
            currencySymbol,
            tokenName,
            uri,
            amount,
            0
          );

          // fails to verify proof
          await expect(
            bridgeHub
              .connect(alice)
              .claimForeignToken(
                bob.address,
                currencySymbol,
                tokenName,
                uri,
                amount,
                key,
                proof
              )
          ).to.revertedWith("Bondly: failed to verify proof");

          // claim success
          await expect(
            bridgeHub
              .connect(alice)
              .claimForeignToken(
                alice.address,
                currencySymbol,
                tokenName,
                uri,
                amount,
                key,
                proof
              )
          ).to.emit(bridgeHub, "Claim");

          // fails: reclaim using the same proof
          await expect(
            bridgeHub
              .connect(alice)
              .claimForeignToken(
                alice.address,
                currencySymbol,
                tokenName,
                uri,
                amount,
                key,
                proof
              )
          ).to.revertedWith("Bondly: already claimed");

          const claimEvents = await bridgeHub.queryFilter(
            bridgeHub.filters.Claim()
          );

          const eventArgs = claimEvents.reverse()[0].args;

          expect(eventArgs.recipient).to.equal(alice.address);
          expect(eventArgs.amount.toNumber()).to.equal(amount);

          const token = bridgeChild.attach(eventArgs.token);
          expect(await token.currencySymbol()).to.equal(currencySymbol);
          expect(await token.tokenNames(eventArgs.tokenId)).to.equal(tokenName);
          expect(await token.uri(eventArgs.tokenId)).to.equal(uri);

          await expect(
            token.connect(alice).setCurrencySymbol(currencySymbol)
          ).to.revertedWith("BridgeChild: only hub contract");

          await expect(
            token
              .connect(alice)
              .mintToken(alice.address, amount, tokenName, uri)
          ).to.revertedWith("BridgeChild: only hub contract");

          await expect(
            token
              .connect(alice)
              .safeTransferFrom(
                alice.address,
                bridgeHub.address,
                eventArgs.tokenId,
                amount,
                "0x00"
              )
          ).to.revertedWith("BridgeChild: cannot transfer to hub contract");
        }
      )
    );
  });

  it("returnForeignToken", async () => {
    const {
      bridgeHub,
      bridgeChild,
      signers: [alice],
      flatFee,
    } = context;

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0 }),
        fc.integer({ min: 1 }),
        fc.string(),
        byte32(),
        cardanoAddress(),
        async (currencySymbol, amount, uri, tokenName, cardanoAddress) => {
          const { proof, key } = claimForeignTokenProof(
            alice.address,
            currencySymbol,
            tokenName,
            uri,
            amount,
            0
          );

          await bridgeHub
            .connect(alice)
            .claimForeignToken(
              alice.address,
              currencySymbol,
              tokenName,
              uri,
              amount,
              key,
              proof
            );

          const claimEvents = await bridgeHub.queryFilter(
            bridgeHub.filters.Claim()
          );
          const eventArgs = claimEvents.reverse()[0].args;
          const token = bridgeChild.attach(eventArgs.token);

          await expect(
            token
              .connect(alice)
              .returnForeignToken(
                eventArgs.tokenId,
                "invalid cardano address",
                amount + 1,
                0,
                { value: 0 }
              )
          ).to.revertedWith(
            "BridgeChild: insufficient token balance of the caller"
          );

          await expect(
            token
              .connect(alice)
              .returnForeignToken(
                eventArgs.tokenId,
                "invalid cardano address",
                amount,
                0,
                { value: 0 }
              )
          ).to.revertedWith("BridgeChild: invalid recipient");

          await expect(
            token
              .connect(alice)
              .returnForeignToken(
                eventArgs.tokenId,
                cardanoAddress,
                amount,
                0,
                { value: flatFee - 1 }
              )
          ).to.revertedWith("BridgeChild: fee amount not match");

          const balance = await bridgeHub.feeBalance();
          await expect(
            token
              .connect(alice)
              .returnForeignToken(
                eventArgs.tokenId,
                cardanoAddress,
                amount,
                0,
                { value: flatFee }
              )
          )
            .to.emit(bridgeHub, "ReturnForeignToken")
            .withArgs(
              cardanoAddress,
              currencySymbol,
              eventArgs.tokenId,
              tokenName,
              amount
            );
          expect((await bridgeHub.feeBalance()).toHexString()).to.equal(
            balance.add(flatFee).toHexString()
          );
        }
      )
    );
  });

  it("BridgeHub: update merkle proof", async () => {
    const {
      mock721,
      mock1155,
      bridgeHub,
      signers: [alice],
    } = context;

    let tokenId = 2;

    await mock721.connect(alice).mint(alice.address, tokenId, "some uri");
    await expect(
      mock721
        .connect(alice)
        ["safeTransferFrom(address,address,uint256,bytes)"](
          alice.address,
          bridgeHub.address,
          tokenId,
          depositBytes([keccak256(mock1155.address)], "DdzFFxxxxxx")
        )
    ).to.emit(bridgeHub, "NativeTokenDeposited");

    await expect(
      bridgeHub.updateTreeHash(ethers.constants.HashZero)
    ).to.revertedWith("Bondly: invalid hash");

    await fc.assert(
      fc.asyncProperty(
        byte32(),
        cardanoAddress(),
        async (merkleProof, recipient) => {
          tokenId += 1;
          await mock721.connect(alice).mint(alice.address, tokenId, "some uri");
          await bridgeHub.updateTreeHash(merkleProof);

          await expect(
            mock721
              .connect(alice)
              ["safeTransferFrom(address,address,uint256,bytes)"](
                alice.address,
                bridgeHub.address,
                tokenId,
                depositBytes([keccak256(mock1155.address)], recipient)
              )
          ).revertedWith("Bondly: token not whitelisted");
        }
      )
    );
  });
});
