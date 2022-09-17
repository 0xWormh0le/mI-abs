import React from "react";
import { Link } from "react-router-dom";
import { ApiTypes } from "../../../types/api";
import styles from "./index.module.scss";
import { User } from "./User";
import PMXLabel from "../PMXlabel";

interface NftProps {
  id: string | number;
  filename: string;
  price: bigint;
  name: string;
  status?: string;
  users: ApiTypes.Model.User[];
  handleNavigate: () => void;
}

export const NftCard = ({
  id,
  filename,
  price,
  name,
  status,
  users,
  handleNavigate,
}: NftProps) => {
  return (
    <figure key={id} className={styles.item}>
      {/*TODO: deal with video*/}
      <Link to={`/marketplace/${id}`} onClick={handleNavigate}>
        <div className={styles.file}>
          <div className={styles.viewport}>
            <img src={filename} alt={name} />
          </div>
        </div>
      </Link>
      <figcaption>
        <div className={styles.titleWrapper}>
          <h4 className={styles.title}>{name}</h4>
          <div className={styles.price}>
            <PMXLabel price={price} />
          </div>
        </div>
        <div className={styles.profiles}>
          {users.map(() => (
            <User />
          ))}
        </div>
        {status && (
          <>
            <hr className={styles.divider} />
            <div className={styles.meta}>
              <div className={styles.status}>{status}</div>
            </div>
          </>
        )}
      </figcaption>
    </figure>
  );
};
