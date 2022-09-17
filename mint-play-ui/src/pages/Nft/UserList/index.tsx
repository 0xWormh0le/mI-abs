import React from 'react';
import { ApiTypes } from '../../../types/api';
import styles from './index.module.scss';

type Props = {
  users: ApiTypes.Model.User[];
}

export const UserList = ({users}: Props) => {
  return (
    <ul>
      {users.map((user, index) =>
        <li>
          <div className={styles.user}>
            <div className={styles.profilePicture}>
              <img src={user.profilePicture} alt=""/>
            </div>
            <div className={styles.info}>
              <div
                className={styles.status}>{index === 0 ? 'Owner' : ''}{index === users.length - 1 ? 'Creator' : ''}</div>
              <div className={styles.name}>{user.name}</div>
            </div>
          </div>
        </li>)}
    </ul>
  )
}
