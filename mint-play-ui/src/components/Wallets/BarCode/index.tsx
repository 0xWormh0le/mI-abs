import styles from './index.module.scss';
// import QRCode from "react-qr-code";
import { Button } from '../../General/Button';

interface Props {
  value: string
  isConnected: boolean
  onConnect: () => void
}

export const BarCode = ({ value, isConnected, onConnect }: Props) => {
  return (
    <div className={styles.qrWrapper}>
      <h2 className={styles.qrTitle}>Scan to connect</h2>
      <p className={styles.qrTitleNote}>Powered by UI8.Wallet</p>
      <div className={styles.qrCodeWrapper}>
        {/* <QRCode
          value={value}
          size={128}
          bgColor={'#000'}
          fgColor={'#fff'}
        /> */}
      </div>
      <div className={styles.buttonWrapper}>
        <Button outlined onClick={onConnect}>Don't have a Wallet?</Button>
      </div>
    </div>
  )
};