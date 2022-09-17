import React from 'react';
import {Button} from '../../../../components/General/Button';
import styles from './index.module.scss';
import {ReactSVG} from 'react-svg';
import spinner from '../../../../assets/svg/spinner-big.svg';
import copy from '../../../../assets/svg/copy.svg';
import classNames from 'classnames';
import {ApiTypes} from '../../../../types/api';
import {pmxFromUnits} from '../../../../utils/convertPrice';
import {getOwner} from '../../../../utils/mapping';

type Props = {
  onNext?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  nft: ApiTypes.Model.NFTInfo
};

export const Start = ({onNext, onCancel, nft}: Props) => {
  return <div className={styles.wrap}>
    <h3 className={styles.title}>Checkout</h3>
    <div className={styles.content}>
      <p>You are about to purchase <b>{nft.name}</b> from <b>{getOwner(nft).name}</b></p>
      <div className={styles.price}>
        <div className={styles.metaInfo}>Price</div>
        <div>{typeof nft.price === 'bigint' && pmxFromUnits(nft.price, 3)} PMX</div>
      </div>
      <div className={styles.balance}>
        <div className={styles.metaInfo}>Your balance</div>
        <div>{pmxFromUnits(8498000000n, 3)} PMX</div>
      </div>
    </div>
    <div className={styles.buttons}>
      <Button  onClick={onNext}>Continue</Button>
      <Button  onClick={onCancel} outlined={true}>Cancel</Button>
    </div>
  </div>
}
export const Processing = ({onNext, onCancel, isLoading}: Props) => {
  return <div className={styles.wrap}>
    <h3 className={styles.title}>Follow steps</h3>
    <div className={styles.content}>
      <div className={styles.loading}>
        <div className={classNames([styles.indicator, {[styles.spin]: isLoading}])}><ReactSVG src={spinner}/></div>
        <div>
          <div className={styles.status}>Purchasing</div>
          <div className={styles.description}>Sending transaction to your wallet</div>
        </div>
      </div>
    </div>
    <div className={styles.buttons}>
      <Button disabled={isLoading} size="big" onClick={onNext}>Continue</Button>
      <Button size="big" onClick={onCancel} outlined={true}>Cancel</Button>
    </div>
  </div>
}
export const Success = ({nft}: Props) => {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return <div className={styles.wrap}>
    <h3 className={styles.gratz}>Yay! 🎉</h3>
    <div className={classNames(styles.content, styles.center)}>
      <p>You successfully purchased<br/><b>{nft.name}</b> from <b>{getOwner(nft).name}</b></p>
      <div className={styles.result}>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className={styles.success}>Processing</span></td>
              <td>
                <a href="/">0msx836930...87r398</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.showOff}>
        Show off your new NFT!
        <ReactSVG onClick={copyLink} className={styles.shareIcon} src={copy}/>
      </div>
    </div>
  </div>
}
