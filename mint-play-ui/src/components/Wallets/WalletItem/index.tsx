import styles from './index.module.scss'
import classNames from 'classnames'
import { WalletType } from '../../../types/wallets'


interface Props {
  title: string
  variant: WalletType.Variant
  activeVariant: WalletType.Variant
  onWalletClick: (value: WalletType.Variant) => void
}

export const WalletItem = ({ variant, title, activeVariant, onWalletClick }: Props) => {
  const isActive = activeVariant === variant

  return (
    <div onClick={() => onWalletClick(isActive ? '' : variant)} className={classNames(
      styles.walletItem,
      isActive && styles.active
    )}>
      <span className={classNames(
        styles.iconWrapper,
        isActive ? styles.active : styles[variant]
      )} />
      <span className={styles.walletName}>{title}</span>
    </div>
  )
}