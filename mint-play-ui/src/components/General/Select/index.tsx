import React from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import ReactSelect, {components} from "react-select";
import {ReactSVG} from "react-svg";
import chevron from "../../../assets/svg/chevron.svg";

interface SelectOption {
  label: string;
  value?: string;
}

type Props<T extends SelectOption> = {
  className: string;
  options: T[];
  label?: string;
  labelClass?: string;
  onChange?: (option: T | null) => void;
  containerClass?: string;
};

export function Select<T extends SelectOption>({
  className,
  options,
  label,
  labelClass,
  onChange,
  containerClass,
}: Props<T>) {
  return (
    <>
      <label className={classNames(styles.container, containerClass)}>
        <div className={classNames(styles.label, labelClass)}>{label}</div>
        <ReactSelect<T>
          components={{
            DropdownIndicator: (props) => (
              <components.DropdownIndicator {...props}>
                <ReactSVG src={chevron}/>
              </components.DropdownIndicator>
            ),
          }}
          defaultValue={options[0]}
          className={classNames(styles.wrap, className)}
          options={options}
          isSearchable={false}
          onChange={onChange}
        />
      </label>
    </>
  );
}
