import React from "react";
import styles from "./index.module.scss";
import {Button} from "../../components/General/Button";
import {Modal} from "../../components/General/Modal";
import {Buy} from "./Modals/Buy";
import {ApiTypes} from "../../types/api";
import { pmxFromUnits } from '../../utils/convertPrice';
import {getOwner} from '../../utils/mapping';

export const PurchaseBox = ({nft}: { nft: ApiTypes.Model.NFTInfo }) => {
  return (
    <div className={styles.purchaseBox}>
      {nft.lastSalePrice && (
        <div className={styles.lastPurchase}>
          <div className={styles.profilePicture}>
            <img src={getOwner(nft).profilePicture} alt=""/>
          </div>
          <div>
            <div className={styles.by}>
              Last purchase by
              <span className={styles.name}>{getOwner(nft).name}</span>
            </div>
            {typeof nft.lastSalePrice === 'bigint' && <div className={styles.cost}>{pmxFromUnits(nft.lastSalePrice, 3)} PMX</div>}
          </div>
        </div>
      )}
      <Modal toggle={<Button className={styles.action}>Purchase now</Button>}>
        <Buy nft={nft}/>
      </Modal>
    </div>
  );
};
