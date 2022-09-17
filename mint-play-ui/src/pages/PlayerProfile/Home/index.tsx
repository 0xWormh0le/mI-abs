import {useState} from "react";
import {Button} from "../../../components/General/Button";
import Tab from "../../../components/General/Tab";
import Footer from "../../../components/Layout/Footer";
import Player from "../../../components/Profile/Player";
import edit from "../../../assets/svg/edit.svg";
import styles from "./index.module.scss";
import OnSale from "./sale";
import {Link} from "react-router-dom";

const Home = () => {
  type Tabs = 'On Sale' | 'Owned';
  const [activeTab, setActiveTab] = useState<Tabs>("On Sale");
  const tabs: Tabs[] = ["On Sale", "Owned"];
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.container}>
          <Link to="/profile/edit">
            <Button outlined className={styles["edit-button"]}>
              Edit Profile{" "}
              <img src={edit} alt="edit" className={styles["edit-icon"]}/>
            </Button>
          </Link>
        </div>
      </div>
      <div className={styles.container}>
        <div className="row">
          <div className={`${styles.player} col-md-5`}>
            <Player
              name="Enrico Cole"
              address="addr1v8aazvl9..xggr"
              description="A wholesome farm owner in Montana. Join me making art on twitch, discord or patreon."
              url="https://deviantart.net/supakilla33"
              totalPmx="103.203"
              username="SupaKilla33"
              pmx="3.302"
            />
          </div>
          <div className={`${styles["nft-container"]} col-md-7`}>
            <div className={styles["tab-container"]}>
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  title={tab}
                  onClick={() => setActiveTab(tab)}
                  active={activeTab === tab}
                />
              ))}
            </div>
            {activeTab === "On Sale" && <OnSale />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
