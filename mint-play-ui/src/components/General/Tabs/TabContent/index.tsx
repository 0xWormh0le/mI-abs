import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type Props = {
  active: boolean;
  children: React.ReactNode;
};

export const TabContent = ({active = false, children}: Props) => {
  return (
    <div className={classNames([styles.container, {[styles.active]: active}])}>
      {children}
    </div>
  )
}
