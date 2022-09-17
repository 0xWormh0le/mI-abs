import styles from "./index.module.scss";
import { pmxFromUnits } from '../../../utils/convertPrice';

interface PMXProps {
  price?: bigint;
}
const PMXLabel = ({ price }: PMXProps) => (
  typeof price === 'bigint' ? <span className={styles.crypto}>{pmxFromUnits(price, 3)} PMX</span> : null
);

export default PMXLabel;
