import {createApi} from "@reduxjs/toolkit/query/react"
import {ApiTypes} from '../../types/api';
import baseQuery from './baseQuery';

type User = ApiTypes.Model.User;

type NFTInfo = ApiTypes.Model.NFTInfo;

export const nftApi = createApi({
  reducerPath: 'nft',
  baseQuery: baseQuery({baseUrl: '/market'}),
  endpoints: (builder) => ({
    showNft: builder.query<NFTInfo, Pick<NFTInfo, 'id'>>({
      query: ({id}) => `/show/${id}`,
      transformResponse: (response: NFTInfo) => response && {
        ...response,
        price: BigInt(response.price),
        lastSalePrice: BigInt(response.lastSalePrice)
      },
    }),
    mintMft: builder.query<NFTInfo, NFTInfo>({
      query: (nft) => ({
        url: `/mint`,
        method: 'POST',
        body: nft,
      }),
    }),
    changePrice: builder.mutation<NFTInfo, Pick<NFTInfo, 'id' | 'price'>>({
      query: ({id, price}) => ({
        url: `/changeprice/${id}`,
        method: 'PUT',
        body: {newPrice: price},
      }),
    }),
    removeFromSale: builder.mutation<NFTInfo, Pick<NFTInfo, 'id'>>({
      query: ({id}) => ({
        url: `/removefromsale/${id}`,
        method: 'DELETE',
      }),
    }),
    buyNft: builder.mutation<NFTInfo, Pick<NFTInfo, 'id'> & Pick<User, 'userId'>>({
      query: ({id, userId}) => ({
        url: `/buy/${id}/${userId}`,
        method: 'POST',
        body: {}
      }),
    }),
    sellNft: builder.mutation<NFTInfo, Pick<NFTInfo, 'id' | 'price'>>({
      query: ({id, price}) => ({
        url: `/sell/${id}`,
        method: 'POST',
        body: {price},
      }),
    }),
  }),
})

export const {
  useShowNftQuery,
  useChangePriceMutation,
  useBuyNftMutation,
  useMintMftQuery,
  useRemoveFromSaleMutation,
  useSellNftMutation,
  reducer,
} = nftApi
