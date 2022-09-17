import classNames from "classnames";
import styles from "./index.module.scss";

interface Props {
  title: string;
  active?: boolean;
  wide?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Tab = ({title, active, wide, onClick}: Props) => (
  <button
    onClick={onClick}
    role="tab"
    className={classNames(styles.tab, {
      [styles["tab-active"]]: active,
      [styles["tab-wide"]]: wide,
    })}
  >
    {title}
  </button>
);

export default Tab;
