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
}

export const PlayerNftCard = ({
  id,
  filename,
  price,
  name,
  status,
  users,
}: NftProps) => {
  return (
    <figure key={id} className={styles.item}>
      {/*TODO: deal with video*/}
      <Link to={`/marketplace/${id}`}>
        <div className={styles.file}>
          <img src={filename} alt={name} />
        </div>
      </Link>
      <figcaption className={styles.data}>
        <h4 className={styles.title}>{name}</h4>
        <div className={styles.profiles}>
          {users.map(() => (
            <User />
          ))}
        </div>
        <div className={styles.price}>
          <PMXLabel price={price} />
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
