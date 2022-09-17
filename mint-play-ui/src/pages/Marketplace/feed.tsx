import {useEffect, useRef} from "react";
import styles from "./index.module.scss";
import {ReactSVG} from "react-svg";
import {NftCard} from "../../components/General/NftCard";
import {Button} from "../../components/General/Button";
import spinner from "../../assets/svg/spinner.svg";
import {ApiTypes} from "../../types/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setMode, setScrollPosition} from './UIslice';
import classNames from 'classnames';

type Props = {
  nfts: ApiTypes.Model.NFTInfo[];
  page: number;
  setPage: (page: number) => void;
  loadMore: () => void;
  isLoading: boolean;
};

export const Feed = ({nfts, page, setPage, isLoading}: Props) => {
  const FeedRef = useRef<HTMLDivElement>(null);
  const verticalScroll = useAppSelector(state => state.UI.scrollPosition);
  const mode = useAppSelector(state => state.UI.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, verticalScroll);
    return () => {
      dispatch(setScrollPosition(window.scrollY));
      window.scrollTo(0, 0);
    };
  }, [])
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  }

  return (
    <main ref={FeedRef}>
      {mode === "OnePage" && (
        <div className={styles.list}>
          {nfts.map((item) => (
            <NftCard
              key={item.id}
              id={item.id}
              price={item.price}
              filename={item.filename}
              name={item.name}
              users={item.previousOwners}
              handleNavigate={handleScroll}
            />
          ))}
        </div>
      )}
      {mode === "InfiniteScroll" && (
        <InfiniteScroll
          dataLength={nfts.length}
          next={() => {
            setPage(page + 1);
          }}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <div className={styles.list}>
            {nfts.map((item) => (
              <NftCard
                key={item.id}
                id={item.id}
                price={item.price}
                filename={item.filename}
                name={item.name}
                users={item.previousOwners}
                handleNavigate={handleScroll}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
      {mode === "OnePage" && (
        <div className={styles.load}>
          <Button outlined onClick={() => {
            dispatch(setMode("InfiniteScroll"))
          }}>
            <ReactSVG className={classNames([styles.spinner, {[styles.spinning]: isLoading}])} src={spinner}/>Load more
          </Button>
        </div>
      )}
    </main>
  );
};
