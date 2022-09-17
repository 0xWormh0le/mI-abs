import React from 'react';
import styles from '../index.module.scss';
import {Placement} from '../Placement';
import {Avatar} from '../../../components/General/Avatar';

type Props = {
  user: {
    name: string,
    rank: number,
    kills: number,
    profilePicture: string,
    estimatedPayout: number
  }
};
export const Row = ({user}: Props) => {
  return <tr key={user.name}>
    <td>
      <Placement rank={user.rank}/>
    </td>
    <td>
      <Avatar className={styles.avatar} src={user.profilePicture}/>
    </td>
    <td className={styles.desktop}>
      {user.name}
    </td>
    <td className={styles.desktop}>
      {user.kills} PSP
    </td>
    <td className={styles.desktop}>
      {user.estimatedPayout} PMX
    </td>
    <td className={styles.mobile}>
      <div>{user.name}</div>
      <div><span className={styles.hype}>{user.kills} PSP</span>{user.estimatedPayout} PMX</div>
    </td>
  </tr>
}
