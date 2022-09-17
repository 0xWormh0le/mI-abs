import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { Provider } from "react-redux";
import { marketApi, reducer, useGetMarketQuery } from "../marketApi";
import { buildMockNfts, stringifyJson } from "../../../utils/api";
import { PER_PAGE } from "../../../CONSTS";
import { setupApiStore } from "../../../utils/testUtils";

beforeEach((): void => {
  fetchMock.resetMocks();
});

const testData: {
  limit: number;
  order: "asc";
  query: string;
  page: number;
} = {
  limit: PER_PAGE,
  order: "asc",
  query: "testQuery",
  page: 10,
};

describe("Market api", () => {
  const storeRef = setupApiStore(marketApi, {
    [marketApi.reducerPath]: reducer,
  });
  fetchMock.mockResponse(stringifyJson({ results: [] }));

  test("minimal request", () => {
    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(marketApi.endpoints.getMarket.initiate({}))
        .then(() => {
          expect(fetchMock).toBeCalledTimes(1);
          const { method, url } = fetchMock.mock.calls[0][0] as Request;

          expect(method).toBe("GET");
          expect(url).toBe(`/market/search?limit=${PER_PAGE}&page=1`);
        })
    );
  });
  test("request with page", () => {
    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(
          marketApi.endpoints.getMarket.initiate({
            limit: testData.limit,
            page: testData.page,
          })
        )
        .then(() => {
          expect(fetchMock).toBeCalledTimes(1);
          const { method, url } = fetchMock.mock.calls[0][0] as Request;

          expect(method).toBe("GET");
          expect(url).toBe(
            `/market/search?limit=${testData.limit}&page=${testData.page}`
          );
        })
    );
  });
  test("request with sorting", () => {
    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(
          marketApi.endpoints.getMarket.initiate({
            limit: testData.limit,
            order: testData.order,
          })
        )
        .then(() => {
          expect(fetchMock).toBeCalledTimes(1);
          const { method, url } = fetchMock.mock.calls[0][0] as Request;

          expect(method).toBe("GET");
          expect(url).toBe(
            `/market/search?limit=${testData.limit}&page=1&sort_by=price&order=${testData.order}`
          );
        })
    );
  });
  test("search request", () => {
    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(
          marketApi.endpoints.getMarket.initiate({
            limit: testData.limit,
            query: testData.query,
          })
        )
        .then(() => {
          expect(fetchMock).toBeCalledTimes(1);
          const { method, url } = fetchMock.mock.calls[0][0] as Request;

          expect(method).toBe("GET");
          expect(url).toBe(
            `/market/search?limit=${testData.limit}&page=1&query=${testData.query}`
          );
        })
    );
  });
  test("search request with sorting", () => {
    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(marketApi.endpoints.getMarket.initiate(testData))
        .then(() => {
          expect(fetchMock).toBeCalledTimes(1);
          const { method, url } = fetchMock.mock.calls[0][0] as Request;

          expect(method).toBe("GET");
          expect(url).toBe(
            `/market/search?limit=${testData.limit}&page=${testData.page}&query=${testData.query}&sort_by=price&order=${testData.order}`
          );
        })
    );
  });
  test("successful response", () => {
    const storeRef = setupApiStore(marketApi, {
      [marketApi.reducerPath]: reducer,
    });
    fetchMock.mockResponse(
      stringifyJson({
        results: buildMockNfts(testData.limit),
      })
    );

    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(
          marketApi.endpoints.getMarket.initiate({ limit: testData.limit })
        )
        .then((action: any) => {
          const { status, data, isSuccess } = action;
          expect(status).toBe("fulfilled");
          expect(isSuccess).toBe(true);
          expect(data).toStrictEqual({
            results: buildMockNfts(testData.limit),
          })
        })
    );
  });
  test("unsuccessful response", () => {
    const storeRef = setupApiStore(marketApi, {
      [marketApi.reducerPath]: reducer,
    });
    fetchMock.mockReject(new Error("Internal Server Error"));

    return (
      storeRef.store
        // @ts-ignore
        .dispatch<any>(
          marketApi.endpoints.getMarket.initiate({ limit: testData.limit })
        )
        .then((action: any) => {
          const {
            status,
            error: { error },
            isError,
          } = action;
          expect(status).toBe("rejected");
          expect(isError).toBe(true);
          expect(error).toBe("Error: Internal Server Error");
        })
    );
  });
});

const updateTimeout = 5000;

const wrapper: React.FC = ({ children }) => {
  const storeRef = setupApiStore(marketApi, {
    [marketApi.reducerPath]: reducer,
  });
  return <Provider store={storeRef.store}>{children}</Provider>;
};

describe("useGetMarketQuery", () => {
  it("Success", async () => {
    fetchMock.mockResponse(
      stringifyJson({ results: buildMockNfts(testData.limit) })
    );
    const { result, waitForNextUpdate } = renderHook(
      () => useGetMarketQuery(testData),
      { wrapper }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it("Internal Server Error", async () => {
    fetchMock.mockReject(new Error("Internal Server Error"));
    const { result, waitForNextUpdate } = renderHook(
      () => useGetMarketQuery(testData),
      { wrapper }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});
