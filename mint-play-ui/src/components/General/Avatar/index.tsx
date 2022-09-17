import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
// View component to make avatars square and round
// set size through css class
type Props = {
  src: string,
  className?: string,
  alt?: string,
};

export const Avatar = ({src, className, alt = 'avatar'}: Props) => (
  <div className={classNames(styles.profilePicture, className)}>
    <img src={src} alt={alt}/>
  </div>
)
