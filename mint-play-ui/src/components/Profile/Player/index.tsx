import React from "react";
import copy from "../../../assets/svg/copy.svg";
import icon from "../../../assets/svg/url.svg";
import trophy from "../../../assets/svg/trophy.svg";
import styles from "./index.module.scss";

interface PlayerProps {
  name: string;
  description: string;
  address: string;
  url: string;
  pmx: string;
  totalPmx: string;
  username: string;
}
const Player: React.FC<PlayerProps> = ({
  name,
  description,
  address,
  url,
  pmx,
  username,
  totalPmx,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <span />
        <h2 className={styles.name}>{name}</h2>
        <div className="d-flex align-items-center justify-content-center mb-3">
          <p>{address}</p>
          <img src={copy} className={styles.copy} alt="copy" />
        </div>
        <p>{description}</p>
        <div className={styles["url-container"]}>
          <img src={icon} alt="url" className={styles["url-logo"]} />
          <h4>{url}</h4>
        </div>
        <p className={styles.text}>Current Ranking</p>
        <div className={styles.ranking}>
          <img src={trophy} alt="trophy" />
          <div>
            <h4>{username}</h4>
            <div className="d-flex align-items-center justify-content-center">
              <h5>{pmx}</h5>
              <p className="mt-1"> PMX</p>
            </div>
          </div>
        </div>
        <p className={styles.text}>Lifetime</p>
        <div className="d-flex align-content-center mb-5">
          <h5>{totalPmx}</h5>
          <p> PMX earned to date</p>
        </div>
      </div>
      <div className={styles.bootom}>
        <p>Member since Mar 15, 2021</p>
      </div>
    </div>
  );
};

export default Player;
