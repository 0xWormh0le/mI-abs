import * as fc from "fast-check";
import { ethers } from "hardhat";

const cardanoAddrPrefix = ["Ae2", "DdzFF", "addr1"];

export const cardanoAddress = () =>
  fc
    .string({ minLength: 5 })
    .map((x) => cardanoAddrPrefix[x.length % cardanoAddrPrefix.length] + x);

export const byte32 = () => fc.string().map((x) => ethers.utils.hashMessage(x));

export const address = () =>
  fc.string().map((x) => ethers.utils.hashMessage(x).slice(0, 42));
