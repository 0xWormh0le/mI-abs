import React from 'react';
import styles from './index.module.scss';
import {Button} from '../../components/General/Button';
import logo from '../../assets/img/logo-lg.png';
import player from "../../assets/img/player.png";
import classNames from 'classnames';

export const Promo = () => {
  return <div className={classNames(styles.promo, styles.container)}>
    <div>
      <h4 className={styles.supCTA}>Get Paid to Play</h4>
      <h2 className={styles.CTA}>Earn crypto with<br/><i>Player<span>Mint</span></i></h2>
      <h6 className={styles.subCTA}>The free-to-play way to earn more from your gaming experience. Profit from gameplay
        performance and virtual
        creations.</h6>
      <Button className={classNames(styles.action, styles.desktop)} outlined={true}>How it Works</Button>
    </div>
    <div>
      <img src={logo} alt="playerMint"/>
      <img className={styles.player} src={player} alt="playerMint"/>
      <Button className={classNames(styles.action, styles.mobile)} outlined={true}>How it Works</Button>
    </div>
  </div>
}
