import React, { useState } from 'react';
import styles from './index.module.scss';
import { Circle } from '../Circle';
import { Textfit } from 'react-textfit';
import { Avatar } from '../../../components/General/Avatar';
import { ApiTypes } from '../../../types/api';
import { useResponsive } from '../../../utils/responsiveHook';
import { Tabs } from 'components/General/Tabs';
import Launch from '../Launch';
import { ClaimBuyPmx } from './ClaimBuyPmx';
import { ClaimPmx } from './ClaimPmx';

type Props = {
  user: ApiTypes.Model.LeaderboardInfo;
  total: ApiTypes.Res.ViewLeaderboard;
  isLaunched?: boolean;
};

export const Featured = ({ total, user, isLaunched }: Props) => {
  const [pmx, setPmx] = useState('75.097');
  const [ada, setAda] = useState('0.0');
  const d = total.nextPayout;
  const isMobile = useResponsive({ phone: true });
  const nextPayout = `${d.getDay()}d ${d.getHours()}h ${d.getMinutes()}m`;
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>
        Leader<span className={styles.green}>board</span>
      </h1>
      <div className={styles.card}>
        <div className={styles.total}>
          <h3 className={styles.epoch}>
            Epoch <span className={styles.value}>32</span>
          </h3>
          <Circle className={styles.prize} big={!isMobile}>
            <div className={styles.pool}>
              <div className={styles.value}>
                <Textfit mode="single">300PMX</Textfit>
              </div>
              <div className={styles.label}>Prize Pool</div>
            </div>
          </Circle>
          <table className={styles.stats}>
            <tr>
              <td>Current Players</td>
              <td className={styles.value}>{total.numPlayers}</td>
            </tr>
            <tr>
              <td>Time Until Payout</td>
              <td className={styles.value}>{nextPayout}</td>
            </tr>
          </table>
        </div>
        {!isLaunched ? (
          <ClaimBuyPmx user={user} pmx={pmx} setPmx={setPmx} ada={ada} setAda={setAda} />
        ) : <ClaimPmx user={user} /> }
      </div>
    </div>
  );
};
