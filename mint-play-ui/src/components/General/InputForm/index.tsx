import { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

interface InputProps {
  label?: string;
  placeholder?: string;
  textClass?: string;
  type?: "text" | "number";
  textarea?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputForm = ({
  placeholder,
  textClass,
  type,
  textarea,
  value,
  onChange,
  label,
}: InputProps) => {
  return (
    <>
      <label>{label}</label>
      {textarea ? (
        <textarea
          className={classNames(styles.input, textClass)}
          placeholder={placeholder}
          value={value}
        />
      ) : (
        <input
          placeholder={placeholder}
          className={classNames([styles.input, textClass])}
          type={type}
          value={value}
          onChange={(e) => (onChange ? onChange(e) : {})}
        />
      )}
    </>
  );
};

export default InputForm;
