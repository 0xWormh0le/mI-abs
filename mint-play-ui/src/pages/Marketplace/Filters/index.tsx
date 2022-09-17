import React, {useState} from "react";
import styles from "./index.module.scss";
import {Button} from "../../../components/General/Button";
import close from "../../../assets/svg/close.svg";
import {ReactSVG} from "react-svg";
import classNames from "classnames";
import {Select} from "../../../components/General/Select";

type orderValue = 'asc' | 'desc';
type Option = { label: string; value?: orderValue };
type Props = {
  priceFilter: (order?: orderValue) => void;
};

export const Filters = ({priceFilter}: Props) => {
  const [isPopupOpen, setPopupState] = useState(false);
  const togglePopup = () => {
    setPopupState(!isPopupOpen);
  };
  const noop: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
  };

  const options: Option[] = [
    {value: undefined, label: "Random"},
    {value: "desc", label: "High to low"},
    {value: "asc", label: "Low to high"},
  ];
  const handleChange = (option: Option | null) => {
    priceFilter(option?.value);
  }

  return (
    <div className={styles.filters}>
      <Button onClick={togglePopup} className={styles.toggle}>
        Filter
      </Button>
      <div
        className={classNames(styles.backdrop, {
          [styles.hidden]: !isPopupOpen,
        })}
        onClick={togglePopup}
      >
        <div className={styles.popup} onClick={noop}>
          <h3 className={styles.title}>Filters</h3>
          <ReactSVG
            src={close}
            className={styles.close}
            onClick={togglePopup}
          />
          <div className={styles.filter}>
            <Select<Option> onChange={handleChange} options={options} className={styles.select} label="price"/>
          </div>
        </div>
      </div>
    </div>
  );
};
