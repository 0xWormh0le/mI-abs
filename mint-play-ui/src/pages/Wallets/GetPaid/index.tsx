import {useState} from 'react';
import styles from './index.module.scss';
import epicGamesIcon from '../../../assets/svg/epic-games.svg';
import getPaid from '../../../assets/svg/get-paid.svg';
import {Button} from '../../../components/General/Button';
import {ReactSVG} from 'react-svg';
import {Link} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAccount } from "../../../store/authSlice";

export const GetPaid = () => {
  const account = useAppSelector((state) => state.auth.account)
  const dispatch = useAppDispatch();

  const onSignIn = () => {
    dispatch(setAccount({
      wallet: 'NAMI',
      name: 'Test User',
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, ipsa.',
      website: 'https://stackoverflow.com/',
      proflePicture: 'https://picsum.photos/200/200',
      coverPhoto: 'https://picsum.photos/800',
      pmxPro: false,
      sellingNFTs: [],
      ownedNFTs: [],
      mintedNFTs: [],
    }));
  }

  return (
    <div className={styles.getPaidWrapper}>
      <header className={styles.getPaidHeader}>
        <h2 className={styles.getPaidTitle}>Get <span>Paid</span> to <span>Play</span></h2>
        {
          !account ?
            <>
              <p className={styles.getPaidText}>Start earning PMX by autheticating your Epic Games account. This will
                grant you access to PMX Prize Pools earned via gameplay performance that are paid out every 5 days or
                epoch.</p>
              <p className={styles.getPaidText}>Authentication is done through <a
                href="https://dev.epicgames.com/en-US/services">Epic Online Services</a>. PlayerMint never knows your
                Epic Games password.</p>
              <Button className={styles.getPaidButton} wide onClick={onSignIn}>
                <ReactSVG className={styles.buttonIcon} src={epicGamesIcon}/>Sign in with Epic Games
              </Button>
            </> :
            <>
              <p className={styles.getPaidText}>Congratulations! You have successfully authenticated your account.
                <div className={styles.userNameWrapper}>
                  <span className={styles.userName}>
                    {account?.name &&
                    <>
                      <ReactSVG className={styles.userNameIcon} src={epicGamesIcon} />
                      {account?.name}
                    </>}
                  </span>
                </div>
              </p>
              <Link to="/">
                <Button wide>Continue</Button>
              </Link>
            </>
        }
      </header>
      <ReactSVG className={styles.getPaidImage} src={getPaid} />
    </div>
  )
}
