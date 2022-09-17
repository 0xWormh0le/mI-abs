import {Helmet} from "react-helmet";
import {Welcome} from "../../components/Onboarding/Welcome";
import {Gallery} from "../../components/Onboarding/Gallery";
import styles from "./index.module.scss";

const Onboarding = () => {
  return (
    <>
      <Helmet>
        <title>PlayerMint - Get Paid to Play</title>
      </Helmet>
      <main className={styles.onboardingWrapper}>
        <Welcome/>
        <Gallery/>
      </main>
    </>
  );
};

export default Onboarding;
