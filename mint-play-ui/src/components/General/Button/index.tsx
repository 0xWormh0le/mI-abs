import React from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

interface Props {
  size?: 'small' | 'big'
  wide?: true
  outlined?: true
  disabled?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button: React.FC<Props> = ({
  size,
  disabled,
  outlined,
  children,
  className,
  wide,
  onClick
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        size && styles[size],
        outlined && styles.outlined,
        wide && styles.wide,
        className && className
      )}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
