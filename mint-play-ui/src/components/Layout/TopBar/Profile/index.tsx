import styles from './index.module.scss';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../store/hooks';

export const Profile = () => {
  const account = useAppSelector((state) => state.auth.account);

  return (
    <Link className={styles.profileButton} to="/profile">
      {account?.proflePicture && (
        <img className={styles.profileAvatar} src={account?.proflePicture} alt={account?.name} />
      )}
      <span>{account?.name || 'Profile'}</span>
    </Link>
  );
};
