import styles from "./index.module.scss";
import { Button } from "../../General/Button";

export const Welcome = () => (
  <section className={styles.welcomeWrapper}>
    <div className={styles.container}>
      <h2 className={styles.welcomeTitle}>
        Get <span>Paid</span> to <span>Play</span>
      </h2>
      <p className={styles.welcomeText}>
        The free-to-play way to earn more from your gaming experience. Profit
        from gameplay performance and virtual creations.
      </p>
      <Button>How It works</Button>
    </div>
  </section>
);
