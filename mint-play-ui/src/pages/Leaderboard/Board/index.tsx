import React from 'react';
import styles from '../index.module.scss';
import {ApiTypes} from '../../../types/api';
import {ReactSVG} from 'react-svg';
import arrow from '../../../assets/svg/arrow.svg'
import {Row} from './Row';

export const Board = ({users = []}: { users?: ApiTypes.Model.LeaderboardInfo[] }) => {
  return <div>
    <div className={styles.container}>
      <div className={styles.board}>
        <header className={styles.header}>
          <h3>Epoch<span>32</span></h3>
          <button className={styles.findMe}>Find me in the leaderboard</button>
        </header>
        <table className={styles.list}>
          <tbody>
            {users.map(user => (
              <Row user={user}/>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button className={styles.prev}><ReactSVG src={arrow}/></button>
          <button className={styles.next}><ReactSVG src={arrow}/></button>
        </div>
      </div>
    </div>
  </div>
}
