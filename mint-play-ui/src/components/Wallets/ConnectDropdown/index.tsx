import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import { Button } from "../../General/Button";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { Checkbox } from '../../General/Checkbox';

// TODO: Adjust props as necessary after adding Redux
interface ConnectDropdownProps {
  connectWallet: () => void;
}

function useOutsideAlerter(ref: any, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export const ConnectDropdown = ({connectWallet}: ConnectDropdownProps) => {
  const [isOpen, setOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [highlightCheckbox, setHighlightCheckbox] = useState(false);
  const history = useHistory();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setOpen(false));

  const flashTextbox = () => {
    setHighlightCheckbox(true);
    setTimeout(() => setHighlightCheckbox(false), 1000);  }

  const handleConnectClick = () => {
    if (!hasAgreed) {
      flashTextbox();
      return;
    }

    connectWallet();
    setOpen(false);
    history.push("/wallets/congratulations");
  };

  return (
    <div className={styles.dropdownWrapper} ref={wrapperRef}>
      <Button size='small' onClick={() => setOpen(!isOpen)}>Connect to wallet</Button>
      {isOpen && <div className={styles.dropdown} >
        <ul>
          <li className={classNames(styles.dropdownItem, { [styles.flashBackground]: highlightCheckbox })}>
            <Checkbox isChecked={hasAgreed} name="terms-of-service" onChange={()=>setHasAgreed(!hasAgreed)}>I agree to the terms of service</Checkbox>
          </li>
          <li className={styles.dropdownItem}>
            <div className={styles.walletItem} onClick={handleConnectClick}>
              <span className={classNames(styles.walletIconWrapper, styles.nami)} />
              <div className={styles.walletNameWrapper}>
                <span className={styles.walletName}>Nami</span>
              </div>
            </div>
          </li>
          <li className={styles.dropdownItem}>
            {/* TODO: link to actual Nami explanation page */}
            <Link to="/" className={classNames(styles.dropdownItemLink, styles.nami)} onClick={() => { setOpen(false) }}>What’s Nami Wallet?</Link>
          </li>
        </ul>
      </div>}
    </div>
  );
};
