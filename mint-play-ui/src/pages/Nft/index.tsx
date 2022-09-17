import React from "react";
import {useParams} from "react-router-dom";
import styles from "./index.module.scss";
import {Tabs} from "../../components/General/Tabs";
import {UserList} from "./UserList";
import {Properties} from "./Properties";
import Footer from "../../components/Layout/Footer";
import {Buttons} from "./Buttons";
import {PurchaseBox} from "./PurchaseBox";
import {buildMockNft} from "../../utils/api";
import {getCreator, royaltyToPercentage} from "../../utils/mapping";
import {Helmet} from 'react-helmet';
import {pmxFromUnits} from '../../utils/convertPrice';

export const Nft = () => {
  const { nftId } = useParams<{ nftId: string }>();

  // TODO: Replace with Redux logic and add error handling for invalid nftIds
  const nft = buildMockNft(parseInt(nftId));

  return (
    <>
      <Helmet>
        <title>{nft.name} | PlayerMint</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.visual}>
          <img src={nft.filename} alt={nft.name} />
        </div>
        <div className={styles.info}>
          <Buttons nft={nft} title={nft.name}/>
          <h1 className={styles.title}>{nft.name}</h1>
          <div className={styles.prices}>
            {typeof nft.price === 'bigint' && <span className={styles.crypto}>{pmxFromUnits(nft.price, 3)} PMX</span>}
          </div>
          <p className={styles.description}>{nft.description}</p>
          <Tabs
            tabs={[
              {
                title: "History",
                content: <UserList users={nft.previousOwners} />,
              },
              {
                title: "Properties",
                content: (
                  <Properties creator={getCreator(nft)} text={nft.properties} />
                ),
              },
              {
                title: "Royalty",
                content: (
                  <Properties
                    creator={getCreator(nft)}
                    text={`${
                      getCreator(nft).name
                    } will take a ${royaltyToPercentage(
                      nft.royalties
                    )}% royalty on all sales of this NFT.`}
                  />
                ),
              },
            ]}
          />
          <PurchaseBox nft={nft} />
        </div>
      </div>
      <Footer />
    </>
  );
};
