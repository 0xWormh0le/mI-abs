import { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { WalletItem } from '../../../components/Wallets/WalletItem';
import { WalletType } from '../../../types/wallets';
import { BarCode } from '../../../components/Wallets/BarCode';
import { TermsOfService } from '../../../components/Wallets/TermsOfService';
import { Hexagons } from '../../../components/Wallets/Hexagons';
import { Button } from '../../../components/General/Button';
import { Link } from 'react-router-dom';

export const Connect = () => {
  const [activeVariant, setActiveVariant] = useState<WalletType.Variant>('');
  const [isAgree, setAgree] = useState(false);
  const [isConnected, setConnected] = useState(false)

  const renderCurrentView = () => {
    if (activeVariant && !isConnected) {
      return <BarCode value='nami'
        isConnected={isConnected}
        onConnect={() => setConnected(!isConnected)} />
    }
    if (activeVariant && isConnected) {
      return <TermsOfService isAgree={isAgree}
        onSetAgree={setAgree}
        onCancel={() => setConnected(false)}
      />
    }
    else {
      return <Hexagons />
    }
  }

  return (
    <section>
      <header className={classNames(styles.titleWrapper, styles.container)}>
        <h2 className={styles.title}>Connect Your Cardano Wallet</h2>
      </header>
      <div className={styles.container}>
        <div className={styles.walletsWrapper}>
          <div className={styles.listWraper}>
            <WalletItem
              variant='nami'
              title='Nami'
              activeVariant={activeVariant}
              onWalletClick={setActiveVariant}
            />
            <div className={styles.buttonWrapper}>
              <Link to='/' className={styles.buttonWrapper}>
                <Button outlined className={styles.walletsButton}>Without wallets</Button>
              </Link>
            </div>
          </div>
          {renderCurrentView()}
        </div>
      </div>
    </section>
  )
};