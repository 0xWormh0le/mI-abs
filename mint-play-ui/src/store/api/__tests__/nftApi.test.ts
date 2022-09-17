import fetchMock from "jest-fetch-mock";
import {nftApi, reducer} from "../nftApi";
import {setupApiStore} from "../../../utils/testUtils";
import {buildMockNfts, stringifyJson} from '../../../utils/api';

beforeEach((): void => {
  fetchMock.resetMocks();
});

const testData: {
  id: string,
  userId: number,
  price: bigint,
  query: string,
} = {
  id: '123',
  userId: 10,
  price: 10022n,
  query: 'testQuery',
};

describe("NFt api", () => {
  const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
  fetchMock.mockResponse(stringifyJson({}));

  test("minimal request", () => {
    return storeRef.store
      // @ts-ignore
      .dispatch<any>(
        nftApi.endpoints.showNft.initiate({id: testData.id}),
      )
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const {method, url} = fetchMock.mock.calls[0][0] as Request;

        expect(method).toBe("GET");
        expect(url).toBe(`/market/show/${testData.id}`);
      });
  });

  test("successful response", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockResponse(stringifyJson(buildMockNfts(1)[0]));

    return storeRef.store
      // @ts-ignore
      .dispatch<any>(
        nftApi.endpoints.showNft.initiate({id: testData.id}),
      )
      .then((action: any) => {
        const {status, data, isSuccess} = action;
        expect(status).toBe("fulfilled");
        expect(isSuccess).toBe(true);
        expect(data).toStrictEqual(buildMockNfts(1)[0]);
      });
  });

  test("unsuccessful response", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockReject(new Error("Internal Server Error"));

    return storeRef.store
      // @ts-ignore
      .dispatch<any>(
        nftApi.endpoints.showNft.initiate({id: testData.id}),
      )
      .then((action: any) => {
        const {
          status,
          error: {error},
          isError,
        } = action;
        expect(status).toBe("rejected");
        expect(isError).toBe(true);
        expect(error).toBe("Error: Internal Server Error");
      });
  });
});

describe("Mutations", () => {
  test("change price success", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockResponse(stringifyJson({}));
    return storeRef.store
      // @ts-ignore
      .dispatch<any>(nftApi.endpoints.changePrice.initiate({id: testData.id, price: testData.price}))
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const {method, url} = request;

        void request.json().then((data) => {
          expect(data).toStrictEqual({newPrice: testData.price.toString()});
        });
        expect(method).toBe("PUT");
        expect(url).toBe(`/market/changeprice/${testData.id}`);
      });
  });

  test("remove from sale success", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockResponse(stringifyJson({}));
    return storeRef.store
      // @ts-ignore
      .dispatch<any>(nftApi.endpoints.removeFromSale.initiate({id: testData.id}))
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const {method, url} = request;

        expect(method).toBe("DELETE");
        expect(url).toBe(`/market/removefromsale/${testData.id}`);
      });
  });

  test("buy success", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockResponse(stringifyJson({}));
    return storeRef.store
      // @ts-ignore
      .dispatch<any>(nftApi.endpoints.buyNft.initiate({id: testData.id, userId: testData.userId}))
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const {method, url} = request;

        void request.json().then((data) => {
          expect(data).toStrictEqual({});
        });
        expect(method).toBe("POST");
        expect(url).toBe(`/market/buy/${testData.id}/${testData.userId}`);
      });
  });

  test("sell success", () => {
    const storeRef = setupApiStore(nftApi, {[nftApi.reducerPath]: reducer});
    fetchMock.mockResponse(stringifyJson({}));
    return storeRef.store
      // @ts-ignore
      .dispatch<any>(nftApi.endpoints.sellNft.initiate({id: testData.id, price: testData.price}))
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const {method, url} = request;

        void request.json().then((data) => {
          expect(data).toStrictEqual({price: testData.price.toString()});
        });
        expect(method).toBe("POST");
        expect(url).toBe(`/market/sell/${testData.id}`);
      });
  });
});
