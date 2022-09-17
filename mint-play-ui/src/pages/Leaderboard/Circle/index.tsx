import React, { FC } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import info from '../../../assets/svg/info.svg';
import { ReactSVG } from 'react-svg';

type Props = {
  label?: string;
  className?: string;
  big?: boolean;
  type?: 'simple';
  isIcon?: boolean;
};
export const Circle: FC<Props> = ({ children, className, big = true, label, type, isIcon }) => {
  return (
    <div className={classNames(className)}>
      <div className={classNames(styles.circle, type && styles[type])}>
        <div className={styles.content}>{children}</div>
        {!type &&
          (big ? (
            <svg className={styles.dashed} preserveAspectRatio="xMinYMin meet" viewBox="0 0 450 451" fill="none">
              <circle cx="225" cy="225" r="210" stroke="url(#paint0_linear_12_7730)" strokeWidth="30" />
              <circle cx="225" cy="225" r="210" stroke="#464B50" strokeWidth="30" />
              <circle cx="225" cy="225" r="210" stroke="url(#paint1_linear_12_7730)" stroke-width="30" />
              <circle cx="225" cy="225" r="210" stroke="#464B50" stroke-width="30" />
              <circle cx="225" cy="225" r="210" stroke="url(#paint2_linear_12_7730)" stroke-width="30" />
              <circle cx="225" cy="225" r="210" stroke="#464B50" stroke-width="30" />
              <circle cx="225" cy="225" r="210" stroke="url(#paint3_linear_12_7730)" stroke-width="30" />
              <circle cx="225" cy="225" r="210" stroke="#464B50" stroke-width="30" />
              <circle
                cx="225"
                cy="226"
                r="210"
                stroke="#979797"
                stroke-opacity="0.01"
                stroke-width="30"
                stroke-linejoin="round"
                stroke-dasharray="64 3"
              />
              <circle
                cx="225"
                cy="226"
                r="210"
                stroke="#464B50"
                stroke-width="30"
                stroke-linejoin="round"
                stroke-dasharray="64 3"
              />
              <circle
                cx="225"
                cy="226"
                r="210"
                stroke="url(#paint4_linear_12_7730)"
                stroke-width="30"
                stroke-linejoin="round"
                stroke-dasharray="64 3"
              />
              <circle
                cx="225"
                cy="226"
                r="210"
                stroke="#464B50"
                stroke-width="30"
                stroke-linejoin="round"
                stroke-dasharray="64 3"
              />
              <circle
                cx="225"
                cy="226"
                r="210"
                stroke="url(#paint5_linear_12_7730)"
                stroke-width="30"
                stroke-linejoin="round"
                stroke-dasharray="64 3"
              />
              <path
                d="M437 226C437 343.084 342.084 438 225 438C107.916 438 13 343.084 13 226C13 108.916 107.916 14 225 14C342.084 14 437 108.916 437 226ZM29.9628 226C29.9628 333.716 117.284 421.037 225 421.037C332.716 421.037 420.037 333.716 420.037 226C420.037 118.284 332.716 30.9628 225 30.9628C117.284 30.9628 29.9628 118.284 29.9628 226Z"
                fill="url(#paint6_linear_12_7730)"
              />
              <path
                d="M437 226C437 343.084 342.084 438 225 438C107.916 438 13 343.084 13 226C13 108.916 107.916 14 225 14C342.084 14 437 108.916 437 226ZM17.6409 226C17.6409 340.521 110.479 433.359 225 433.359C339.521 433.359 432.359 340.521 432.359 226C432.359 111.479 339.521 18.6409 225 18.6409C110.479 18.6409 17.6409 111.479 17.6409 226Z"
                fill="#474B50"
              />
              <path
                d="M428 226C428 338.114 337.114 429 225 429C112.886 429 22 338.114 22 226C22 113.886 112.886 23 225 23C337.114 23 428 113.886 428 226ZM27.0177 226C27.0177 335.343 115.657 423.982 225 423.982C334.343 423.982 422.982 335.343 422.982 226C422.982 116.657 334.343 28.0177 225 28.0177C115.657 28.0177 27.0177 116.657 27.0177 226Z"
                fill="#474B50"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_12_7730"
                  x1="225"
                  y1="-225"
                  x2="-225"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00D33C" />
                  <stop offset="1" stop-color="#00BC82" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_12_7730"
                  x1="225"
                  y1="675"
                  x2="675"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#00D33C" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_12_7730"
                  x1="225"
                  y1="-225"
                  x2="-225"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00D33C" />
                  <stop offset="1" stop-color="#00BC82" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_12_7730"
                  x1="225"
                  y1="675"
                  x2="675"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#00D33C" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_12_7730"
                  x1="225"
                  y1="676"
                  x2="675"
                  y2="226"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#00D33C" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_12_7730"
                  x1="225"
                  y1="676"
                  x2="675"
                  y2="226"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#2CD138" />
                </linearGradient>
                <linearGradient
                  id="paint6_linear_12_7730"
                  x1="362.852"
                  y1="68.3054"
                  x2="69.9163"
                  y2="358.108"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#21CC4B" />
                  <stop offset="1" stop-color="#08C077" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg className={styles.dashed} viewBox="0 0 177 177" fill="none">
              <circle cx="88.3038" cy="88.3038" r="81.8038" stroke="url(#paint0_linear_12_7748)" stroke-width="13" />
              <circle cx="88.3038" cy="88.3038" r="81.8038" stroke="#464B50" stroke-width="13" />
              <circle cx="88.3038" cy="88.3038" r="81.8038" stroke="url(#paint1_linear_12_7748)" stroke-width="13" />
              <circle cx="88.3038" cy="88.3038" r="81.8038" stroke="#464B50" stroke-width="13" />
              <circle
                cx="88.3038"
                cy="88.6962"
                r="80.8038"
                stroke="#979797"
                stroke-opacity="0.01"
                stroke-width="15"
                stroke-linejoin="round"
                stroke-dasharray="27 3"
              />
              <circle
                cx="88.3038"
                cy="88.6962"
                r="80.8038"
                stroke="#464B50"
                stroke-width="15"
                stroke-linejoin="round"
                stroke-dasharray="27 3"
              />
              <circle
                cx="88.3038"
                cy="88.6962"
                r="80.8038"
                stroke="url(#paint2_linear_12_7748)"
                stroke-width="15"
                stroke-linejoin="round"
                stroke-dasharray="27 3"
              />
              <circle
                cx="88.3038"
                cy="88.6962"
                r="80.8038"
                stroke="#464B50"
                stroke-width="15"
                stroke-linejoin="round"
                stroke-dasharray="27 3"
              />
              <circle
                cx="88.3038"
                cy="88.6962"
                r="80.8038"
                stroke="url(#paint3_linear_12_7748)"
                stroke-width="15"
                stroke-linejoin="round"
                stroke-dasharray="27 3"
              />
              <path
                d="M168 88.5C168 132.407 132.407 168 88.5 168C44.5934 168 9 132.407 9 88.5C9 44.5934 44.5934 9 88.5 9C132.407 9 168 44.5934 168 88.5ZM15.3606 88.5C15.3606 128.894 48.1062 161.639 88.5 161.639C128.894 161.639 161.639 128.894 161.639 88.5C161.639 48.1062 128.894 15.3606 88.5 15.3606C48.1062 15.3606 15.3606 48.1062 15.3606 88.5Z"
                fill="url(#paint4_linear_12_7748)"
              />
              <path
                d="M168 88.5C168 132.407 132.407 168 88.5 168C44.5934 168 9 132.407 9 88.5C9 44.5934 44.5934 9 88.5 9C132.407 9 168 44.5934 168 88.5ZM10.7404 88.5C10.7404 131.445 45.5545 166.26 88.5 166.26C131.445 166.26 166.26 131.445 166.26 88.5C166.26 45.5545 131.445 10.7404 88.5 10.7404C45.5545 10.7404 10.7404 45.5545 10.7404 88.5Z"
                fill="#474B50"
              />
              <path
                d="M165 88.5C165 130.75 130.75 165 88.5 165C46.2502 165 12 130.75 12 88.5C12 46.2502 46.2502 12 88.5 12C130.75 12 165 46.2502 165 88.5ZM13.8909 88.5C13.8909 129.705 47.2945 163.109 88.5 163.109C129.705 163.109 163.109 129.705 163.109 88.5C163.109 47.2945 129.705 13.8909 88.5 13.8909C47.2945 13.8909 13.8909 47.2945 13.8909 88.5Z"
                fill="#474B50"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_12_7748"
                  x1="88.3038"
                  y1="-88.3038"
                  x2="-88.3038"
                  y2="88.3038"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00D33C" />
                  <stop offset="1" stop-color="#00BC82" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_12_7748"
                  x1="88.3038"
                  y1="264.911"
                  x2="264.911"
                  y2="88.3038"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#00D33C" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_12_7748"
                  x1="88.3038"
                  y1="265.304"
                  x2="264.911"
                  y2="88.6962"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#00D33C" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_12_7748"
                  x1="88.3038"
                  y1="265.304"
                  x2="264.911"
                  y2="88.6962"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00BC82" />
                  <stop offset="1" stop-color="#2CD138" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_12_7748"
                  x1="140.195"
                  y1="29.3645"
                  x2="30.3436"
                  y2="138.041"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#21CC4B" />
                  <stop offset="1" stop-color="#08C077" />
                </linearGradient>
              </defs>
            </svg>
          ))}
      </div>
      {label && (
        <div className={styles.label}>
          {label}
          {isIcon && (
            <div className={styles.info}>
              <ReactSVG src={info} className={styles.info} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
