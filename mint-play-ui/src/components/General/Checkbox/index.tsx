import React from 'react';
import styles from './index.module.scss';

interface Props {
  isChecked: boolean
  name: string
  onChange: (value: boolean) => void
}

export const Checkbox: React.FC<Props> = ({ isChecked, name, onChange, children }) => (
  <>
    <input
      className={styles.input}
      name={name}
      id={name}
      type="checkbox"
      checked={isChecked}
      onChange={() => {/**/}}
    />
    <label
      onClick={() => onChange(!isChecked)}
      className={styles.label}
      htmlFor={name}>
      {children && <span className={styles.text}>{children}</span>}
    </label>
  </>
);