import React from 'react';
import styles from './index.module.scss';
import {ReactSVG} from 'react-svg';
import first from '../../../assets/svg/1st.svg';
import second from '../../../assets/svg/2nd.svg';
import third from '../../../assets/svg/3rd.svg';
import place from '../../../assets/svg/place.svg';

export const Placement = ({rank}: { rank: number }) => {
  const renderCup = () => {
    switch (rank) {
      case 1:
        return <ReactSVG src={first}/>
        ;
      case 2:
        return <ReactSVG src={second}/>
        ;
      case 3:
        return <ReactSVG src={third}/>
        ;
      default:
        return <ReactSVG src={place}/>
    }
  }
  return <div className={styles.wrap}>
    {rank > 3 && <div className={styles.value}>{rank}</div>}
    {renderCup()}
  </div>
}


