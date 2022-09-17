import { useState } from "react"
import { ReactSVG } from 'react-svg'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { Notifications } from "../Notifications"
import hamburger from '../../../../assets/svg/hamburger.svg'
import logo from '../../../../assets/img/logo-sm.png'
import close from '../../../../assets/svg/close.svg'
import classNames from 'classnames'

interface Props {
  isConnected: boolean
}

export const MobileMenu = ({ isConnected }: Props) => {
  const [isMobileMenuOpen, openMobileMenu] = useState(false)

  return (
    <>
      <div className={styles.mobileMenuWrapper}>
        {isConnected && <Notifications />}
        <ReactSVG className={styles.hamburger} src={hamburger} onClick={() => openMobileMenu(!isMobileMenuOpen)} />
      </div>
      {isMobileMenuOpen && <>
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <img className={styles.logo} src={logo} alt='logo' />
            <ReactSVG className={styles.close} src={close} onClick={() => openMobileMenu(!isMobileMenuOpen)} />
          </div>
          {isConnected ? (
            <ul>
              <li className={styles.mobileMenuItem}>
                <Link to="/leaderboard"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.leaderboard])}>
                  Leaderboard
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/marketplace"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.marketplace])}>
                  Marketplace
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/mint"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.mint])}>
                  Mint
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/profile"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.profile])}>
                  My Profile
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.profile])}>
                  PlayerMint Pro
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/wallets/connect"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.wallet])}>
                  Wallet
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.support])}>
                  Support
                </Link>
              </li>
              <li className={styles.mobileMenuItem}>
                <Link to="/"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.logout, styles.red])}>
                  Disconnect
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li className={styles.mobileMenuItem}>
                <Link to="/wallets/congratulations"
                  onClick={() => openMobileMenu(false)}
                  className={classNames([styles.mobileMenuLink, styles.marketplace])}>
                  Connect to wallet
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div className={styles.overlay} onClick={() => openMobileMenu(!isMobileMenuOpen)} />
      </>}
    </>
  )
}