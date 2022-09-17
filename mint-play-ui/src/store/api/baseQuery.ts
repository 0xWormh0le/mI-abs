import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query/react"
import { stringifyJson } from "../../utils/api";

const baseQuery = (args: FetchBaseQueryArgs): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> => {
  const func = fetchBaseQuery(args)
  return (arg, api) => func(
    typeof arg == 'string' ? arg : { ...arg, body: stringifyJson(arg.body) },
    api,
    {}
  )
}

export default baseQuery
