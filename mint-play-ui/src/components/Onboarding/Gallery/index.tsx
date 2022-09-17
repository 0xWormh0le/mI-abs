import styles from "./index.module.scss";
import image1 from "../../../assets/img/gallery-1.jpg";
import image2 from "../../../assets/img/gallery-2.jpg";
import image3 from "../../../assets/img/gallery-3.jpg";
import image4 from "../../../assets/img/gallery-4.jpg";
import image5 from "../../../assets/img/gallery-5.jpg";
import image6 from "../../../assets/img/gallery-6.jpg";
import image7 from "../../../assets/img/gallery-7.jpg";

export const Gallery = () => {
  return (
    <div>
      <div className={styles.galleryWrapper}>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image3})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image4})` }}
        ></div>
      </div>
      <div className={styles.galleryWrapper}>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image3})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image4})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image5})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image6})` }}
        ></div>
        <div
          className={styles.galleryImmage}
          style={{ backgroundImage: `url(${image7})` }}
        ></div>
      </div>
    </div>
  );
};
