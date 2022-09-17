import Footer from "components/Layout/Footer";
import EditMint, { FileExtended } from "components/templates/mint/edit";
import PreviewMint from "components/templates/mint/preview";
import { useState } from "react";
import styles from "./index.module.scss";
import { Helmet } from "react-helmet";
import { pmxToUnits } from "../../utils/convertPrice";

export interface NftMint {
  name: string;
  description: string;
  price?: number;
  editionCount?: number;
  properties: string;
}

const Mint = () => {
  const [files, setFiles] = useState<FileExtended[]>([]);
  const [nftMint, setNFTMint] = useState<NftMint>({
    name: "",
    description: "",
    price: undefined,
    editionCount: undefined,
    properties: "",
  });

  const handleInput = (itemName: string, value?: string | number): void => {
    setNFTMint({
      ...nftMint,
      [itemName]: value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Mint | PlayerMint</title>
      </Helmet>
      <div className={`${styles.container} ${styles.wrapper}`}>
        <EditMint
          handleInput={handleInput}
          nftMint={nftMint}
          setFile={setFiles}
          files={files}
        />
        <PreviewMint
          name={nftMint.name}
          price={pmxToUnits(nftMint.price ?? 0)}
          files={files}
          setFiles={setFiles}
          setNFTMint={setNFTMint}
          editionCount={nftMint.editionCount}
        />
      </div>
      <Footer />
    </>
  );
};

export default Mint;
