import { Textfit } from "react-textfit";
import { Circle } from "../Circle";
import styles from './index.module.scss';
import { ApiTypes } from "../../../types/api";
import { Avatar } from "../../../components/General/Avatar";

type Props = {
  user: ApiTypes.Model.LeaderboardInfo;
}

export const ClaimPmx = ({ user }: Props) => {
  return (
    <div className={styles.player}>
      <h3>Your Ranking</h3>
      <div className={styles.stats}>
        <div className={styles.pay}>
          <Circle className={styles.statCircle} big={false} label="Estimated Payout">
            <div>
              <div className={styles.value}>
                <Textfit mode="single">{user.estimatedPayout?.toLocaleString()}</Textfit>
              </div>
              <div className={styles.label}>PMX</div>
            </div>
          </Circle>
        </div>
        <div className={styles.rank}>
          <Circle className={styles.statCircle} big={false} label="Ranking">
            <Textfit className={styles.value} mode="single" forceSingleModeWidth={false}>
              {user.rank}
            </Textfit>
          </Circle>
        </div>
        <div className={styles.hype}>
          <Circle className={styles.statCircle} big={false} label="HYPE">
            <Textfit className={styles.value} mode="single" forceSingleModeWidth={false}>
              {user.kills}
            </Textfit>
          </Circle>
        </div>
        <figure className={styles.avatar}>
          <Avatar className={styles.profilePicture} src={user.profilePicture} alt={user.name} />
          <figcaption className={styles.nickname}>{user.name}</figcaption>
        </figure>
      </div>
    </div>
  );
}


