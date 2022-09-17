import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import { ecsign } from "ethereumjs-util";
import type { Address, Byte32, CardanoAddress } from "./types";

export const merkleRoot = (leaf: Byte32, proof: Byte32[]) =>
  proof.reduce((acc, cur) => {
    if (acc < cur) {
      return keccak256(acc + de0xify(cur));
    } else {
      return keccak256(cur + de0xify(acc));
    }
  }, leaf);

export const Oxify = (value: string) => "0x" + value;

export const de0xify = (value: string) => value.slice(2);

export const depositBytes = (proof: Byte32[], recipient: CardanoAddress) =>
  Oxify(
    [
      proof.length.toString(16).padStart(2, "0"),
      proof.map(de0xify).join(""),
      Array.from(ethers.utils.toUtf8Bytes(recipient))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
    ].join("")
  );

export const claimNativeTokenProof = (
  recipient: Address,
  token: Address,
  tokenId: number,
  amount: number,
  pkIndex: number
) => {
  const proofKey = ethers.utils.hashMessage(Math.random().toString());
  const msg = keccak256(
    ethers.utils.solidityPack(
      ["address", "address", "uint256", "uint256", "bytes32"],
      [recipient, token, tokenId, amount, proofKey]
    )
  );

  return {
    proof: proof(msg, pkIndex),
    key: proofKey,
  };
};

export const claimForeignTokenProof = (
  recipient: Address,
  currencySymbol: number,
  tokenName: Byte32,
  tokenUri: string,
  amount: number,
  pkIndex: number
) => {
  const proofKey = ethers.utils.hashMessage(Math.random().toString());
  const msg = keccak256(
    ethers.utils.solidityPack(
      ["address", "uint256", "bytes32", "string", "uint256", "bytes32"],
      [recipient, currencySymbol, tokenName, tokenUri, amount, proofKey]
    )
  );

  return {
    proof: proof(msg, pkIndex),
    key: proofKey,
  };
};

const proof = (msg: string, pkIndex: number) => {
  const { v, r, s } = ecsign(
    Buffer.from(de0xify(msg), "hex"),
    Buffer.from(de0xify(pk(pkIndex)), "hex")
  );

  return Oxify(r.toString("hex") + s.toString("hex") + v.toString(16));
};

const pk = (index: number) => {
  const mnemonic =
    "test test test test test test test test test test test junk";
  return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`)
    .privateKey;
};
