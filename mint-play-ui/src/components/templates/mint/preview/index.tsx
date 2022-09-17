import PMXLabel from "components/General/PMXlabel";
import { ReactSVG } from "react-svg";
import styles from "./index.module.scss";
import close from "assets/svg/preview-clear.svg";
import { FileExtended } from "../edit";

interface PreviewProps {
  link?: string;
  name?: string;
  files?: FileExtended[];
  price?: bigint;
  editionCount?: number;
  setFiles: (files: FileExtended[]) => void;
  setNFTMint: (e: any) => void;
}

const users: string[] = ["", "", ""];

const PreviewMint = ({
  name,
  files,
  price,
  editionCount,
  setFiles,
  setNFTMint,
}: PreviewProps) => {
  const getLink = () => {
    if (files && files.length > 0) {
      return files[0].preview;
    } else {
      return "";
    }
  };

  const handleClear = () => {
    setFiles([]);
    setNFTMint({
      name: "",
      description: "",
      price: 0n,
      editionCount: undefined,
      properties: "",
    });
  };
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Preview</p>
      {getLink() && <img src={getLink()} alt="preview" />}
      <div className={styles.items}>
        <p className={styles.name}>{name || "Mint Name"}</p>
        <PMXLabel price={price} />
      </div>
      <div className={styles.items}>
        <div className={styles.avatargroup}>
          {users.map((user, idx) => (
            <div className={styles.avatar}>
              <img src={user} />
            </div>
          ))}
        </div>
        <p className={styles.editionCount}>
          {editionCount}{" "}
          {!!editionCount && (editionCount > 1 ? "editions" : "edition")}
        </p>
      </div>
      <hr className={styles.divider}></hr>
      <div className={styles.new}>New item &#128293;</div>
      <div className={styles.clear} onClick={handleClear}>
        <ReactSVG src={close} className={styles.close} />
        Clear all
      </div>
    </div>
  );
};

export default PreviewMint;
