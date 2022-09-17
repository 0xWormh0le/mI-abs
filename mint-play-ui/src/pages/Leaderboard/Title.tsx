import React from 'react';
import styles from './index.module.scss';
import logo from '../../assets/img/logo-lg.png';

export const Title = () => {
  return <div className={styles.title}>
    <img className={styles.logo} src={logo} alt="playerMint"/>
    <h4 className={styles.motto}>See where you stand and where you have to go</h4>
    <h2 className={styles.welcomeTitle}>
      Get <span>Paid</span> to <span>Play</span>
    </h2>
  </div>
}
