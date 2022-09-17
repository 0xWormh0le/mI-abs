import styles from './index.module.scss';
import {Hexagons} from '../../../components/Wallets/Hexagons';
import {Button} from '../../../components/General/Button';
import {Link} from 'react-router-dom';

export const Congratulations = () => (
  <div className={styles.congratulations}>
    <header className={styles.congratulationsHeader}>
      <h2 className={styles.congratulationsTitle}><span>Congratulations!</span> You have successfully connected your
        wallet.</h2>
      <div className={styles.buttonsWrapper}>
        <Link to="/wallets/get-paid">
          <Button wide>Start Earning PMX</Button>
        </Link>
        <Link to="/marketplace">
          <Button outlined wide>Head to Marketplace</Button>
        </Link>
      </div>
    </header>
    <Hexagons/>
  </div>
)
