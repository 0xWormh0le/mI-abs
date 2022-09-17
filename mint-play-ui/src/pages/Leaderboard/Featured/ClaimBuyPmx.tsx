import { Tabs } from "../../../components/General/Tabs";
import { Textfit } from "react-textfit";
import { Circle } from "../Circle";
import styles from './index.module.scss';
import Launch from "../Launch";
import { ApiTypes } from "types/api";

type Props = {
  user: ApiTypes.Model.LeaderboardInfo;
  pmx: string;
  setPmx: (pmx: string) => void;
  ada: string;
  setAda: (ada: string) => void;
}

export const ClaimBuyPmx = ({ user, pmx, setPmx, ada, setAda }: Props) => {
  return (
    <div className={styles.launchedPlayer}>
      <div className={styles.rankingwrapper}>
        <div className={styles.ranking}>
          <Circle className={styles.statCircle} big={false} label="Ranking" type="simple">
            <Textfit className={styles.rank}>{user.rank}</Textfit>
          </Circle>
        </div>
        <div className={styles.ranking}>
          <Circle className={styles.statCircle} big={false} label="PSP" type="simple" isIcon={true}>
            <Textfit className={styles.psp} mode="single" forceSingleModeWidth={false}>
              {user.kills}
            </Textfit>
          </Circle>
        </div>
        <div className={styles.ranking}>
          <Circle className={styles.statCircle} big={false} label="Estimated Payout" type="simple">
            <div>
              <div className={styles.value}>
                <Textfit mode="single" className={styles.payout}>
                  {user.estimatedPayout?.toLocaleString()}
                </Textfit>
              </div>
              <div className={styles.label}>PMX</div>
            </div>
          </Circle>
        </div>
      </div>
      <div className={styles.claimTabs}>
        <Tabs
          tabs={[
            {
              title: 'Claim',
              content: <Launch type="claim" pmx={pmx} setPmx={setPmx} />,
            },
            {
              title: 'Buy',
              content: <Launch type="buy" pmx={pmx} setPmx={setPmx} ada={ada} setAda={setAda} />,
            },
          ]}
        />
      </div>
    </div>
  );
}