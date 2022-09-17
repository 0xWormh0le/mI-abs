import { Button } from 'components/General/Button';
import { ChangeEvent } from 'react';
import { ReactSVG } from 'react-svg';
import styles from './index.module.scss';
import ArrowDown from '../../../assets/svg/arrow-down.svg';

type LaunchMode = 'claim' | 'buy';

interface Props {
  type: LaunchMode;
  pmx?: string;
  setPmx?: (val: string) => void;
  ada?: string;
  setAda?: (val: string) => void;
}

const Launch = ({ type, pmx, setPmx, ada, setAda }: Props) => {
  let title: string = type === 'claim' ? 'Pending Payouts' : 'Buy PMX';
  let description: string =
    type === 'claim'
      ? 'Claim your PMX by sending ~2 ADA to the PMX claim address. ~1.5 ADA will be returned to your wallet with the PMX.'
      : 'Your 10 Founder NFTs enable you to  buy a maximum of 100 PMX';
  const handleClick = (type: LaunchMode): void => {
    console.log('payout called', type);
  };

  const handleChangePMX = (value: string): void => {
    setPmx && setPmx(value);
  };

  const handleChangeADA = (value: string): void => {
    setAda && setAda(value);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{title}</p>
      <div className={styles.contentWrapper}>
        <div className={styles.insertWrapper}>
          {type === 'claim' ? (
            <div className={styles.insertValue}>
              <input type="number" value={pmx} onChange={(e) => handleChangePMX(e.target.value)} />
              <p className={styles.label}>PMX</p>
            </div>
          ) : (
            <>
              <div className={styles.insertValue}>
                <input type="number" value={ada} onChange={(e) => handleChangeADA(e.target.value)} />
                <p className={styles.label}>ADA</p>
              </div>
              <ReactSVG src={ArrowDown} className={styles.arrow} />
              <div className={styles.insertValue}>
                <input type="number" value={pmx} onChange={(e) => handleChangePMX(e.target.value)} />
                <p className={styles.label}>PMX</p>
              </div>
            </>
          )}
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.btnWrapper}>
          <Button className={styles.btn} onClick={() => handleClick(type)}>
            {type}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Launch;
