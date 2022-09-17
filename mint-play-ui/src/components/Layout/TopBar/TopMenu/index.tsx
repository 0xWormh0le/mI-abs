import styles from './index.module.scss'
import {Link} from 'react-router-dom'

interface Props {
  isConnected: boolean
}

export const TopMenu = ({ isConnected }: Props) => {
  return isConnected ? (
    <div className={styles.authorizedWrapper}>
      <span className={styles.separator} />
      <nav className={styles.menu}>
        <Link className={styles.menuItem} to="/leaderboard">Leaderboard</Link>
        <Link className={styles.menuItem} to="/marketplace">Marketplace</Link>
        <Link className={styles.menuItem} to="/">Support</Link>
      </nav>
    </div>
  ) : <></>
}
