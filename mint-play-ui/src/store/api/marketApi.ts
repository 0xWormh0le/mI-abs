import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {ApiTypes} from '../../types/api';
import {PER_PAGE} from '../../CONSTS';

type NFTInfo = ApiTypes.Model.NFTInfo;
type SearchMarketParams = ApiTypes.Req.SearchMarketParams;

interface ListResponse<T> {
  results: T[]
}

export const marketApi = createApi({
  reducerPath: 'market',
  tagTypes: ['Market'],
  baseQuery: fetchBaseQuery({baseUrl: '/market'}),
  endpoints: (builder) => ({
    getMarket: builder.query<ListResponse<NFTInfo>, Pick<SearchMarketParams, 'limit' | 'order' | 'query' | 'page'>>({
      query: ({limit = PER_PAGE, page = 1, order, query}) =>
        `/search?limit=${limit}&page=${page}${query ? `&query=${query}` : ''}${order ? `&sort_by=price&order=${order}` : ''}`,
      transformResponse: (response: ListResponse<NFTInfo>) => response && {
        results: response.results.map(data => ({
          ...data,
          price: BigInt(data.price),
          lastSalePrice: BigInt(data.lastSalePrice)
        }))
      },
      providesTags: (result) =>
        result
          ? [
            // Provides a tag for each post in the current page,
            // as well as the 'PARTIAL-LIST' tag.
            ...result.results.map(({id}) => ({type: 'Market' as const, id})),
            {type: 'Market', id: 'PARTIAL-LIST'},
          ]
          : [{type: 'Market', id: 'PARTIAL-LIST'}],
    }),
  }),
})

export const {useLazyGetMarketQuery, useGetMarketQuery, reducer} = marketApi
