import React, {useRef, useState} from 'react';
import styles from './index.module.scss';
import {ReactSVG} from 'react-svg';
import classNames from 'classnames';
import {useOutsideClick} from '../../../utils/outsideHook';
import close from '../../../assets/svg/close.svg'

type Props = {
  toggle?: JSX.Element,
  title: string,
  options: {
    label: string,
    icon?: string,
    action?: () => void,
    status?: 'success' | 'warn' | 'error',
  }[]
}
//TODO: add direction support

export const Dropdown = ({toggle, title, options = []}: Props) => {
  const [isVisible, setVisibility] = useState(false);
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    setVisibility(false)
  });
  return <div className={styles.wrap}>
    {React.cloneElement(
      toggle || <button>toggle</button>,
      {
        onClick: () => {
          setVisibility(!isVisible)
        },
      },
    )}
    <div onClick={() => {
      setVisibility(!isVisible)
    }}
    ref={containerRef}
    className={classNames(styles.backdrop, {[styles.hidden]: !isVisible})}>
      <div onClick={(e) => {
        e.stopPropagation()
      }} className={styles.drop}>
        <ReactSVG src={close} className={styles.close} onClick={() => {
          setVisibility(false)
        }}/>
        <h2 className={styles.title}>{title}</h2>
        <ul>
          {options.map((option, index) => (
            <li key={index}>
              <button className={classNames([styles.option, {[styles[option.status!]]: !!option.status}])}
                onClick={option.action}>
                <span className={styles.icon}>{option.icon && <ReactSVG
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '20px')
                  }}
                  src={option.icon}/>}</span>
                <span className={styles.label}>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
}
