import React, {FC, useState} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import {ReactSVG} from 'react-svg';
import close from '../../../assets/svg/close.svg'

type Props = {
  toggle?: any;
  toggleFn?: () => void; // use this to get controlled component
  isOpen?: boolean; // use this to get controlled component
};
// Will use fixed to cover the whole screen,
// might need to use portal in edge cases
export const Modal: FC<Props> = ({toggle, toggleFn, isOpen, children}) => {
  const [isPopupOpen, setPopupState] = useState(false);
  const togglePopup = () => {
    toggleFn ? toggleFn() : setPopupState(!isPopupOpen);
  };
  const noop: React.EventHandler<React.MouseEvent> = e => {
    e.stopPropagation();
  };
  const addToggle = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {togglePopup});
    }
    return child;
  });
  return (
    <div>
      {!toggleFn && React.cloneElement(toggle, {onClick: togglePopup})}
      <div className={classNames(styles.backdrop, {[styles.hidden]: isOpen === undefined ? !isPopupOpen : !isOpen})}
        onClick={togglePopup}>
        <div className={styles.popup} onClick={noop}>
          <ReactSVG src={close} className={styles.close} onClick={togglePopup}/>
          {addToggle}
        </div>
      </div>
    </div>
  )
}
