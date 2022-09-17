import {ApiTypes} from "../types/api";

type User = ApiTypes.Model.User;

type NFTInfo = ApiTypes.Model.NFTInfo;

// TODO: Improve type safety of conversion functions (ideally should not be possible to apply incorrectly)

/**
 * Converts an NFT royalty (expressed as fraction of 1,000,000) into a percentage (fraction of 100).
 * Example: `royaltyToPercentage(500000)` = 50
 */
export const royaltyToPercentage = (royalty: number) => royalty / 10000;

/**
 * Takes an NFT and outputs it's royalties as human readable percentage.
 *
 * Example: a royalty of 50000 is (50000/1000000) or 5%
 * so royaltiesToPercent(50000) returns "5%"
 *
 * Note: this takes NFTInfo as an input for additional type safety over
 * using a raw number.
 * @param nft
 * @returns
 * Converts a percentage (fraction of 100) into an NFT royalty (expressed as fractoin of 1,000,000)
 * Example: `royaltyFromPercentage(50)` = 500000
 */
export const nftToRoyaltyPercentage = (nft: NFTInfo) => {
  return `${(nft.royalties / 10000).toString()}%`;
}

export const getOwner: (nft: NFTInfo) => User = (nft) => {
  return nft.previousOwners[0];
}
export const getCreator: (nft: NFTInfo) => User = (nft) => {
  return nft.previousOwners[nft.previousOwners.length - 1];
}
