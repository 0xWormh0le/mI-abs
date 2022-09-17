import { useState } from "react";
import { Button } from "../../../components/General/Button";
import InputForm from "../../../components/General/InputForm";
import eye from "../../../assets/svg/eye-off.svg";
import close from "../../../assets/svg/clear.svg";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import Footer from "../../../components/Layout/Footer";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");

  const handleClear = () => {
    setName(() => "");
    setBio("");
    setUrl("");
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <Link to="/profile">
            <Button outlined>Back to profile</Button>
          </Link>
          <div className="d-flex">
            <Link to="/profile">Profile</Link>
            <p>&gt;</p>
            <p>Edit Profile</p>
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div>
          <h2 className={styles.title}>
            Edit <span> Profile </span>
          </h2>
          <p className={styles.text}>
            You can set preferred display name, create{" "}
            <span> your profile URL </span> and manage other personal settings.
          </p>
          <div className={`${styles.body} row`}>
            <div className="col-md-6">
              <div className={styles.profile}>
                <div className={styles["profile-image"]}>
                  <span></span>
                </div>
                <div>
                  <h3 className="mb-3">Profile Picture</h3>
                  <p className={`${styles.text} mb-3 `}>
                    We recommend an image of at least 400x400.
                  </p>
                  <Button outlined className={styles["upload-button"]}>
                    Upload
                  </Button>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p>Display Lifetime Earnings</p>
                <img src={eye} alt="hide" className={styles.eye} />
              </div>
              <Button outlined className={styles.authenticate}>
                authenticate gaming account
              </Button>
            </div>
            <div className="col-md-6">
              <h3 className={`${styles.account} mb-4`}>Account Info</h3>
              <div className={styles.input}>
                <InputForm
                  label="USERNAME"
                  placeholder="Enter your Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.input}>
                <InputForm
                  label="bio"
                  placeholder="About yourself in a few words"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div>
                <InputForm
                  label=" url"
                  placeholder="Personal URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className={styles.divider} />
              <div className="d-flex align-items-center">
                <div className={styles["update-button"]}>
                  <Button>Update Profile</Button>
                </div>
                {(name || bio || url) && (
                  <div
                    className="d-flex align-items-center"
                    role="presentation"
                    onClick={handleClear}
                  >
                    <img src={close} alt="close" />
                    <p className={styles.clear}>Clear all</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
