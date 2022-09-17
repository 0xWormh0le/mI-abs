import { ReactSVG } from 'react-svg'
import bell from '../../../../assets/svg/bell.svg'
import styles from './index.module.scss'

export const Notifications = () => {
  return (
    <ReactSVG className={`${styles.bellIcon} ${styles.unread}`} src={bell} />
  )
}