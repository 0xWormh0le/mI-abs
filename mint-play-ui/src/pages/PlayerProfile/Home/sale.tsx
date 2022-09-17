import React from "react";
import spinner from "../../../assets/svg/spinner.svg";
import styles from "./index.module.scss";
import { PlayerNftCard } from "../../../components/General/PlayerNftCard";

function OnSale() {
  const nfts = Array(3).fill({
    id: 1,
    name: "Amazing digital art",
    price: 12,
    filename: `https://picsum.photos/200/300`,
    numEditions: 1,
    previousOwners: ["me", "you"],
    lastSalePrice: null,
    properties: "",
    royalties: 30000,
  });
  return (
    <div>
      <div className={styles.list}>
        {nfts.map((item) => (
          <PlayerNftCard
            key={item.id}
            id={item.id}
            price={item.price}
            filename={item.filename}
            name={item.name}
            users={item.previousOwners}
          />
        ))}
      </div>
      <div className={styles.loader}>
        <img src={spinner} alt="loader" />
      </div>
    </div>
  );
}

export default OnSale;
