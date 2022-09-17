export declare namespace ApiTypes.Model {
  interface User {
    userId: string;
    name: string;
    profilePicture: string;
  }

  interface NFTInfo {
    id: string; // Field name/type subject to change
    name: string;
    price: bigint;
    filename: string;
    numEditions: number;
    previousOwners: User[];
    lastSalePrice: bigint;
    properties: string;
    royalties: number;
    description: string;
  }

  interface LeaderboardInfo {
    name: string;
    profilePicture: string;
    rank: number;
    kills: number;
    estimatedPayout: number;
  }
}

export declare namespace ApiTypes.Req {
  interface CreateAccount {
    wallet: string;
    name: string;
    bio: string;
    website: string;
    proflePicture: string;
    coverPhoto: string;
  }

  interface UpdateAccount {
    wallet: string;
    name: string;
    bio: string;
    website: string;
    proflePicture: string;
    coverPhoto: string;
  }

  interface MintNFT {
    image: string;
    name: string;
    description: string;
    price: bigint;
    editionCount: number;
    properties: string;
    putOnSale: boolean;
    royalty: number;
  }

  interface SearchMarketParams {
    minPrice?: number;
    maxPrice?: number;
    popularity?: "most" | "least";
    creator?: "pro" | "any";
    limit?: number;
    page?: number;
    sortBy?: "price" | "name" | "collection" | "creator";
    order?: "asc" | "desc";
    query?: string;
  }

  interface ChangePrice {
    newPrice: bigint;
  }

  interface SellNFT {
    price: bigint;
  }
}

export declare namespace ApiTypes.Res {
  interface ViewAccount {
    wallet: string;
    name: string;
    bio: string;
    website: string;
    proflePicture: string;
    coverPhoto: string;
    pmxPro: boolean;
    sellingNFTs: ApiTypes.Model.NFTInfo[];
    ownedNFTs: ApiTypes.Model.NFTInfo[];
    mintedNFTs: ApiTypes.Model.NFTInfo[];
  }

  interface ViewLeaderboard {
    numPlayers: number;
    nextPayout: Date;
    myInfo: ApiTypes.Model.LeaderboardInfo;
    topInfo: ApiTypes.Model.LeaderboardInfo[];
  }

  interface LeaderboardRanking {
    profilePicture: string;
    pmxPro: boolean;
    lastEpochEarnings: bigint;
    currentEpochEarnings: bigint;
    nextPayout: Date;
  }

  interface SearchMarket {
    results: ApiTypes.Model.NFTInfo[];
  }
}
