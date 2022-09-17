import React from 'react';
import styles from './index.module.scss';
import {ApiTypes} from '../../../types/api';

type Props = {
  creator: ApiTypes.Model.User;
  text: string;
};

export const Properties = ({creator, text}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div className={styles.profilePicture}>
          <img src={creator.profilePicture} alt=""/>
        </div>
        <div className={styles.info}>
          <div className={styles.status}>Creator <span className={styles.name}>{creator.name}</span></div>
          <div className={styles.text}>{text}</div>
        </div>
      </div>
    </div>
  )
}
