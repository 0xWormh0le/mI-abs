import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Filters } from "./Filters";
import { Feed } from "./feed";
import Footer from "../../components/Layout/Footer";
import { buildMockNfts } from "../../utils/api";
import { ApiTypes } from "../../types/api";
import { useLazyGetMarketQuery } from "store/api/marketApi";
import loader from "../../assets/svg/spinner-big.svg";
import { Helmet } from "react-helmet";
import { PER_PAGE } from "../../CONSTS";
import { debounce } from "debounce";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentPage } from "./UIslice";

type SearchMarketParams = ApiTypes.Req.SearchMarketParams;

const Marketplace = () => {
  const [page, setPage] = useState<SearchMarketParams["page"]>(1);
  const [order, setOrder] = useState<SearchMarketParams["order"]>();
  const [query, setQuery] = useState<SearchMarketParams["query"]>("");
  const [nfts, setNfts] = useState(buildMockNfts(PER_PAGE));
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.UI.currentPage);

  const [trigger, { data, error, isLoading }] = useLazyGetMarketQuery();
  // TODO: Replace with Redux data
  useEffect(() => {
    console.log({ currentPage });

    const requiredMockNftCount = currentPage * PER_PAGE - nfts.length;
    const highestId = Number.parseInt(nfts[nfts.length - 1].id);

    setNfts((state) => [
      ...state,
      ...buildMockNfts(requiredMockNftCount, highestId + 1),
    ]);
  }, [currentPage]);

  const loadMore = () => {
    trigger({ limit: PER_PAGE, page, order, query });
    setPage(page! + 1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);
    debounce(() => setQuery(e.currentTarget.value), 600)();
  };

  return (
    <>
      <Helmet>
        <title>Marketplace | PlayerMint</title>
      </Helmet>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {/*TODO: change to components from #5*/}
          <div className={styles.search}>
            <input onChange={handleSearch} type="text" placeholder="Search" />
          </div>
          <Filters priceFilter={setOrder} />
        </aside>
        {error ? (
          <div>We could not load the posts</div>
        ) : isLoading ? (
          <div>
            <img src={loader} alt="loading..." />
          </div>
        ) : !data ? (
          <>
            <div className={styles["sidebar-base"]} />
            <Feed
              isLoading={isLoading}
              loadMore={loadMore}
              nfts={nfts}
              page={currentPage}
              setPage={(page) => {
                dispatch(setCurrentPage(page));
              }}
            />
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
};

export default Marketplace;
