import styles from './index.module.scss';
import hexagons from '../../../assets/svg/hexagons.svg';
import { ReactSVG } from 'react-svg';

export const Hexagons = () => <ReactSVG className={styles.hexagonsImage} src={hexagons} />;
