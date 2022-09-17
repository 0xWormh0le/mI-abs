import styles from "./index.module.scss";
import mintLogo from "assets/svg/mint-logo.svg";
import spinner from "assets/svg/spinner.svg";
import rightArrow from "assets/svg/right-arrow.svg";
import fileUploader from "assets/svg/file-uploader.svg";
import { ReactSVG } from "react-svg";
import ItemInput from "components/General/ItemInput";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "components/General/Button";
import { NftMint } from "pages/Mint";
import Toggle from "components/General/Toggle";
import { API } from "utils/api";
import { ApiTypes } from "types/api";
import { pmxFromUnits, pmxToUnits } from "../../../../utils/convertPrice";
import { royaltyToPercentage } from "../../../../utils/mapping";

export interface FileExtended {
  file: File;
  base64: string;
  preview: string;
}

interface NftMintEditProps {
  nftMint: NftMint;
  handleInput: (name: string, value: string | number | undefined) => void;
  setFile: (files: FileExtended[]) => void;
  files: FileExtended[];
}

interface MintErrors {
  royalty?: string;
  file?: string;
  price?: string;
}

const EditMint = ({
  nftMint,
  handleInput,
  setFile,
  files,
}: NftMintEditProps) => {
  const [royalty, setRoyalty] = useState("");
  const [validationErrors, setValidationErrors] = useState<MintErrors>({
    royalty: "",
    file: "",
  });
  const [checked, setChecked] = useState(false);
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(
            new Error("Unable to load image as base64: result not a string.")
          );
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    accept: ".jpg, .jpeg, .png",
    onDrop: async (acceptedFiles, fileRejections) => {
      console.log("accepted ==> ", acceptedFiles);
      console.log("rejected ==> ", fileRejections);
      const saveFiles = [];
      for (const file of acceptedFiles) {
        const base64 = await getBase64(file);
        saveFiles.push({
          file,
          base64,
          preview: URL.createObjectURL(file),
        });
      }
      setFile(saveFiles);
    },
    noClick: true,
    noKeyboard: true,
  });

  // Parses royalty percentage
  const parseRoyalty = (royaltyPercentage: string) => {
    const parsed = Number.parseFloat(royaltyPercentage);

    if (Number.isNaN(parsed)) return undefined;

    return royaltyToPercentage(parsed);
  };

  const makeMintParams = (
    file: FileExtended[],
    nftMint: NftMint
  ): ApiTypes.Req.MintNFT | undefined => {
    const errors: MintErrors = {};

    const parsedRoyalty = parseRoyalty(royalty);

    if (!nftMint.price || nftMint.price < 0) {
      errors.price = "Price must be greater than or equal to 0.";
    }

    if (
      parsedRoyalty === undefined ||
      parsedRoyalty < 0 ||
      parsedRoyalty > 50000
    ) {
      errors.royalty = "Royalty must be between 0-50%.";
    }

    if (!file || file.length === 0) {
      errors.file = "No file selected.";
    }

    // TODO: add more validations for all data

    if (Object.keys(errors).length > 0 || !nftMint.price || !parsedRoyalty) {
      setValidationErrors(errors);

      // TODO: Display validation errors in UI and remove log statement
      console.log({ errors });

      return;
    }

    return {
      image: file[0].base64,
      name: nftMint.name,
      description: nftMint.description,
      price: pmxToUnits(nftMint.price),
      editionCount: Number(nftMint.editionCount),
      properties: nftMint.properties,
      putOnSale: checked,
      royalty: parsedRoyalty,
    };
  };

  const onMintClick = () => {
    const mintParams = makeMintParams(files, nftMint);

    if (!mintParams) return;

    API.market.mintNFT(mintParams).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className={styles.wrapper}>
      <ReactSVG src={mintLogo} />
      <div className={styles["upload-wrapper"]}>
        <div className={styles.right}>
          <p className={styles["upload-title"]}>Upload file</p>
          <p className={styles["drag-label"]}>
            Drag or choose your file to upload
          </p>
          <p className={styles.filetype}>
            PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
          </p>
        </div>
        <div
          {...getRootProps({ className: "dropzone" })}
          className={`${styles.upload} ${
            isDragActive ? styles.dragwrapper : ""
          }`}
        >
          <div onClick={() => open()} className={styles.filepicker}>
            <input {...getInputProps()} />
            <ReactSVG src={fileUploader} />
            <p className={styles["file-label"]}>
              PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
            </p>
          </div>
        </div>
      </div>
      <p className={styles.subtitle}>NFT Details</p>
      <div className={styles.long}>
        <ItemInput
          label="NAME"
          value={nftMint.name}
          marginTop="32px"
          placeholder="The Decentralized Perspective"
          onChange={(e) => handleInput("name", e.target.value)}
        />
      </div>
      <div className={styles.long}>
        <ItemInput
          label="DESCRIPTION"
          value={nftMint.description}
          marginTop="32px"
          placeholder="A demonstration of a decentralized mindset"
          onChange={(e) => handleInput("description", e.target.value)}
        />
      </div>
      <div className={styles.short}>
        <ItemInput
          label="PRICE"
          type="number"
          marginTop="32px"
          value={nftMint.price}
          placeholder={nftMint.price ? nftMint.price.toString() : "e.g.10 PMX"}
          onChange={(e) => handleInput("price", e.target.value)}
        />
        <ItemInput
          label="EDITION COUNT"
          type="number"
          value={nftMint.editionCount}
          marginTop="32px"
          placeholder="e.g.3"
          onChange={(e) => handleInput("editionCount", e.target.value)}
        />
        <ItemInput
          label="PROPERTIES"
          value={nftMint.properties}
          marginTop="32px"
          placeholder="e.g.Access to concert"
          onChange={(e) => handleInput("properties", e.target.value)}
        />
      </div>
      <hr className={styles.divider}></hr>
      <div className={styles.subtitle}>
        <p>Put on sale</p>
        <Toggle
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>
      <p className={styles.description}>
        This NFT will be published to the marketplace and minted upon sale. This
        means you will not see it in your wallet, but will receive PMX there
        once it is sold. If you'd like to mint the NFT immediately into your
        wallet" toggle off "Put on sale"
      </p>
      <div className={styles.royalty}>
        <ItemInput
          label="ROYALTY"
          value={royalty}
          type="number"
          placeholder="10%"
          helperText="Suggested: 0%, 10%, 20%, 30%, Maximum is 50%"
          onChange={(e) => setRoyalty(e.target.value)}
        />
      </div>
      <div className={styles.btns}>
        <Button className={styles["nft-btn"]} onClick={onMintClick}>
          Mint NFT
          <ReactSVG className={styles.arrow} src={rightArrow} />
        </Button>
        <Button outlined>
          Auto saving
          <ReactSVG className={styles.spinner} src={spinner} />
        </Button>
      </div>
    </div>
  );
};

export default EditMint;
