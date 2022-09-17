import React from 'react';
import classNames from "classnames";
import styles from "./index.module.scss";

interface Props {
  title: string;
  active?: boolean;
  wide?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Tab = ({title, active, wide, onClick}: Props) => (
  <button
    onClick={onClick}
    role="tab"
    className={classNames(styles.tab, {
      [styles.activeTab]: active,
      [styles["tab-wide"]]: wide,
    })}
  >
    {title}
  </button>
);

