import React from "react";
import { ReactSVG } from "react-svg";
import logo from "../../../assets/img/logo-sm.png";
import discord from "../../../assets/svg/discord.svg";
import text from "../../../assets/svg/logo-text.svg";
import instagram from "../../../assets/svg/instagram.svg";
import twitter from "../../../assets/svg/twitter.svg";
import youtube from "../../../assets/svg/youtube.svg";
import tiktok from "../../../assets/svg/tiktok.svg";
import linkedin from "../../../assets/svg/linkedin.svg";
import spotify from "../../../assets/svg/spotify.svg";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";

const Footer = () => {
  return (
    <div className={styles["footer-wrapper"]}>
      <div className={`${styles.container} ${styles.footer} row`}>
        <ul className={`${styles.first} col-lg-4 col-md-12 col-sm-12`}>
          <li>
            <Link to="/">
              <img className={styles.logo} src={logo} alt='' />
            </Link>
          </li>
          <li>
            <p className={styles.label}>Get Paid to Play</p>
          </li>
        </ul>
        <div className={`${styles.middle} col-lg-4 col-md-6 col-sm-6 row`}>
          <ul className="col-lg-6">
            <li className={styles.header}>PlayerMint</li>
            <li>
              <Link to="/leaderboard" className={styles.linkItem}>Leaderboard</Link>
            </li>
            <li>
              <Link to="/marketplace" className={styles.linkItem}>Marketplace</Link>
            </li>
          </ul>
          <ul className="col-lg-6">
            <li className={styles.header}>Info</li>
            <li>
              <p>About Us</p>
            </li>
            <li>
              <p>Support</p>
            </li>
          </ul>
        </div>
        <ul className={`${styles.last} col-lg-4 col-md-6 col-sm-6`}>
          <li>Join our Discord</li>
          <li className={styles.discord}>
            <Link to="/" className={styles["discord-icon"]}>
              <ReactSVG src={discord} />
            </Link>
            <Link to="/">
              <ReactSVG src={text} />
            </Link>
          </li>
          <li>Follow our Socials</li>
          <ul className={styles.socials}>
            <div>
              <li>
                <Link to="/">
                  <ReactSVG src={instagram} />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <ReactSVG src={twitter} />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <ReactSVG src={tiktok} />
                </Link>
              </li>
            </div>
            <div>
              <li>
                <Link to="/">
                  <ReactSVG src={linkedin} />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <ReactSVG src={youtube} />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <ReactSVG src={spotify} />
                </Link>
              </li>
            </div>
          </ul>
        </ul>
        <div className={styles.bottom}>
          <p>Copyright © 2021 PlayerMint LLC. All rights reserved</p>
          <h4>
            We use cookies for better service. <span>Accept</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Footer;
