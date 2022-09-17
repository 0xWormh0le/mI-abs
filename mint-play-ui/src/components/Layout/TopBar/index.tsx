import styles from './index.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { TopMenu } from './TopMenu';
import { Button } from '../../General/Button';
import logo from '../../../assets/img/logo-sm.png';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import { ConnectDropdown } from '../../Wallets/ConnectDropdown';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setWallet, setPubKeyHash } from '../../../store/walletsSlice';
import classNames from 'classnames';

export const TopBar = () => {
  const account = useAppSelector((state) => state.auth.account);
  const connectedWallet = useAppSelector((state) => state.wallets.connectedWallet);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const isWalletConnected = connectedWallet !== 'NONE';
  const isSignedIn = account ? true : false;

  const connectWallet = () => {
    dispatch(setWallet('NAMI'));
    dispatch(setPubKeyHash(['dkbadugwae9qiugd982y31028ue-qwpoad', 'jbdiwjdsbiuasdb09u210ehoqwbd213qw']));
  };

  const handleClickMint = () => {
    history.push('/mint');
  };

  const handleClickSignIn = () => {
    history.push('/wallets/get-paid');
  };

  return (
    <header className={styles.topBarWrapper}>
      <div className={`${styles.container} ${styles.topBar}`}>
        <Link to="/">
          <img className={styles.logo} src={logo} />
        </Link>

        {isWalletConnected ? (
          <div className={classNames(styles.menuWrapper, { [styles.authorized]: true })}>
            <TopMenu isConnected={true} />
            <Notifications />
            {isSignedIn ? (
              <>
                <Button size="small" onClick={handleClickMint}>
                  Mint
                </Button>
                <Profile />
              </>
            ) : (
              <Button size="small" onClick={handleClickSignIn}>
                Sign in
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.menuWrapper}>
            <TopMenu isConnected={false} />
            <ConnectDropdown connectWallet={connectWallet} />
          </div>
        )}

        <MobileMenu isConnected={isWalletConnected} />
      </div>
    </header>
  );
};
