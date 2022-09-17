import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  DiscountManager,
  DiscountManager__factory,
  Mock20,
  Mock20__factory,
  Mock1155,
  Mock1155__factory,
  Mock721,
  Mock721__factory,
} from "../types";

type Address = string;

type Context = {
  discountManager: DiscountManager;
  mock20: Mock20;
  mock721: Mock721;
  mock1155: Mock1155;
  signers: SignerWithAddress[];
  treasury: Address;
  flatFee: number;
};

const ErrorCode = {
  OK: 0,
  ID_NOT_DEFINED: 1,
  OUT_OF_TIMEFRAME: 2,
  INSUFFICIENT_TOKEN_BALANCE: 3,
  INVALID_TOKEN_TYPE: 4,
  PERCENTAGE_OUT_OF_LIMIT: 5,
  TOKEN_LENGTH_MISMATCH: 6,
  INVALID_TOKEN_LENGTH: 7,
};

const errorMsg = (errCode: number) => `DiscountManagerError(${errCode})`;

describe("DiscountManager", () => {
  const context: Context = {} as Context;

  beforeEach(async () => {
    const Mock721 = (await ethers.getContractFactory(
      "Mock721"
    )) as Mock721__factory;
    const Mock1155 = (await ethers.getContractFactory(
      "Mock1155"
    )) as Mock1155__factory;
    const Mock20 = (await ethers.getContractFactory(
      "Mock20"
    )) as Mock20__factory;
    const DiscountManager = (await ethers.getContractFactory(
      "DiscountManager"
    )) as DiscountManager__factory;

    const signers = await ethers.getSigners();
    const [treasury] = signers;
    const flatFee = 1_000_000;

    const mock721 = await Mock721.deploy();
    const mock1155 = await Mock1155.deploy();
    const mock20 = await Mock20.deploy();
    const discountManager = await DiscountManager.deploy(
      treasury.address,
      flatFee
    );

    context.signers = signers;
    context.flatFee = flatFee;
    context.treasury = treasury.address;
    context.mock721 = mock721;
    context.mock1155 = mock1155;
    context.mock20 = mock20;
    context.discountManager = discountManager;
  });

  describe("addDiscount", () => {
    it("fails: callable by only owner", async () => {
      const {
        discountManager,
        signers: [, alice],
      } = context;

      await expect(
        discountManager.connect(alice).addDiscount([], [], [], 0, 0, 0)
      ).to.revertedWith("Ownable: caller is not the owner");
    });

    it("fails: invalid token length", async () => {
      const {
        discountManager,
        signers: [owner],
      } = context;

      await expect(
        discountManager.connect(owner).addDiscount([], [], [], 0, 0, 0)
      ).to.revertedWith(errorMsg(ErrorCode.INVALID_TOKEN_LENGTH));
    });

    it("fails: token length mismatch", async () => {
      const {
        discountManager,
        mock1155,
        signers: [owner],
      } = context;

      await expect(
        discountManager
          .connect(owner)
          .addDiscount([mock1155.address], [], [], 0, 0, 0)
      ).to.revertedWith(errorMsg(ErrorCode.TOKEN_LENGTH_MISMATCH));
    });

    it("fails: exeeds base percentage", async () => {
      const {
        discountManager,
        mock1155,
        signers: [owner],
      } = context;

      await expect(
        discountManager
          .connect(owner)
          .addDiscount([mock1155.address], [1], [1], 1_000_001, 0, 0)
      ).to.revertedWith(errorMsg(ErrorCode.PERCENTAGE_OUT_OF_LIMIT));
    });

    it("success", async () => {
      const {
        discountManager,
        mock1155,
        mock721,
        mock20,
        signers: [owner],
      } = context;

      await expect(
        discountManager
          .connect(owner)
          .addDiscount(
            [mock20.address, mock721.address, mock1155.address],
            [10, 1, 3],
            [0, 1, 1],
            300_000,
            0,
            0
          )
      ).to.emit(discountManager, "DiscountAdded");
    });
  });

  it("removeDiscount", async () => {
    const {
      discountManager,
      mock1155,
      mock721,
      mock20,
      signers: [owner],
    } = context;

    await expect(
      discountManager
        .connect(owner)
        .addDiscount(
          [mock20.address, mock721.address, mock1155.address],
          [10, 1, 3],
          [0, 1, 1],
          300_000,
          0,
          0
        )
    )
      .to.emit(discountManager, "DiscountAdded")
      .withArgs(1);

    await expect(discountManager.removeDiscount(1))
      .to.emit(discountManager, "DiscountRemoved")
      .withArgs(1);

    await expect(discountManager.getDiscount(1)).to.revertedWith(
      errorMsg(ErrorCode.ID_NOT_DEFINED)
    );
  });

  describe("feeAmount", () => {
    beforeEach(async () => {
      const {
        discountManager,
        mock1155,
        mock721,
        mock20,
        signers: [owner],
      } = context;

      await discountManager
        .connect(owner)
        .addDiscount(
          [mock20.address, mock721.address, mock1155.address],
          [10, 1, 3],
          [0, 1, 1],
          300_000,
          0,
          0
        );
    });

    it("fails: id not defined", async () => {
      const {
        discountManager,
        signers: [alice],
      } = context;

      await expect(discountManager.feeAmount(alice.address, 2)).to.revertedWith(
        errorMsg(ErrorCode.ID_NOT_DEFINED)
      );
    });

    it("fails: insufficient token balance", async () => {
      const {
        discountManager,
        mock20,
        mock721,
        signers: [alice],
      } = context;

      // insufficient 20 token balance
      await expect(discountManager.feeAmount(alice.address, 1)).to.revertedWith(
        errorMsg(ErrorCode.INSUFFICIENT_TOKEN_BALANCE)
      );
      await mock20.mint(alice.address, 10);

      // insufficient 721 token balance
      await expect(discountManager.feeAmount(alice.address, 1)).to.revertedWith(
        errorMsg(ErrorCode.INSUFFICIENT_TOKEN_BALANCE)
      );
      await mock721.mint(alice.address, 1, "");

      // insufficient 1155 token balance
      await expect(discountManager.feeAmount(alice.address, 1)).to.revertedWith(
        errorMsg(ErrorCode.INSUFFICIENT_TOKEN_BALANCE)
      );
    });

    it("success: flat fee if id is not given", async () => {
      const {
        discountManager,
        flatFee,
        signers: [alice],
      } = context;

      expect(await discountManager.feeAmount(alice.address, 0)).to.equal(
        flatFee
      );
    });

    it("success: discount if id is given", async () => {
      const {
        discountManager,
        mock1155,
        mock721,
        mock20,
        flatFee,
        signers: [alice],
      } = context;

      await mock721.mint(alice.address, 1, "");
      await mock1155.mint(alice.address, 1, 3, "");
      await mock20.mint(alice.address, 10);

      expect(await discountManager.feeAmount(alice.address, 1)).to.equal(
        flatFee * 0.7
      );
    });
  });

  it("getAllDiscounts", async () => {
    const {
      discountManager,
      mock1155,
      mock721,
      mock20,
      signers: [owner, alice],
    } = context;

    await discountManager
      .connect(owner)
      .addDiscount(
        [mock20.address, mock721.address, mock1155.address],
        [10, 1, 3],
        [0, 1, 1],
        300_000,
        0,
        0
      );

    await mock721.mint(alice.address, 1, "");
    await mock1155.mint(alice.address, 1, 3, "");
    await mock20.mint(alice.address, 10);

    await discountManager
      .connect(owner)
      .addDiscount([mock20.address], [10], [0], 300_000, 0, 0);

    await discountManager.connect(owner).removeDiscount(2);

    await discountManager
      .connect(owner)
      .addDiscount([mock20.address], [11], [0], 300_000, 0, 0);

    const allDiscounts = await discountManager.getAllDiscounts(alice.address);

    expect(allDiscounts.list.length).to.equal(2);
    expect(allDiscounts.validity).to.eql([
      ErrorCode.OK,
      ErrorCode.INSUFFICIENT_TOKEN_BALANCE,
    ]);

    const discounts = await discountManager.getAllDiscounts(
      ethers.constants.AddressZero
    );

    expect(discounts.validity).to.eql([ErrorCode.OK, ErrorCode.OK]);
  });

  it("updateTreasuryAddress", async () => {
    const {
      discountManager,
      signers: [owner, alice],
    } = context;

    await expect(
      discountManager.connect(alice).updateTreasuryAddress(alice.address)
    ).to.revertedWith("Ownable: caller is not the owner");

    await expect(
      discountManager.connect(owner).updateTreasuryAddress(alice.address)
    ).to.emit(discountManager, "TreasuryUpdated");
  });

  it("updateFlatFee", async () => {
    const {
      discountManager,
      signers: [owner, alice],
    } = context;

    await expect(
      discountManager.connect(alice).updateFlatFee(0)
    ).to.revertedWith("Ownable: caller is not the owner");
    await expect(discountManager.connect(owner).updateFlatFee(0)).to.emit(
      discountManager,
      "FlatFeeUpdated"
    );
  });
});
