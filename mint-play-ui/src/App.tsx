import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";
import styles from "./index.module.scss";
import { TopBar } from "./components/Layout/TopBar";
import { validator } from "./tmp"
import {
  callMintNFT,
  callListNFT,
  callGetPrice,
  AssetClass,
  Config,
  ServerConfig,
  EndpointParams,
  MintNFTArgs,
  ListNFTArgs
} from "cardano-transaction-lib-playermint"

const serverConfig: ServerConfig = {
  host: "ctl.playermint-backend.staging.mlabs.city",
  port: 443,
  secure: true
}

const ogmiosConfig: ServerConfig = {
  host: "ogmios.playermint-backend.staging.mlabs.city",
  port: 443,
  secure: true
}

const datumCacheConfig: ServerConfig = {
  host: "datum-cache.playermint-backend.staging.mlabs.city",
  port: 443,
  secure: true
}

const config: Config = {
  serverConfig,
  ogmiosConfig,
  datumCacheConfig,
  logLevel: "Trace",
  networkId: 0,
  projectId: "testnetEx6pHjuExpaoZo029I9eSVnLLVwrkyBf"
}

const endpointParams: EndpointParams = {
  validator,
  configCurrencySymbol: '5b60f22e0d0b9ecc1523b8ba4a513a1cceeb78a4ddd42424bb3550bd'
}

const mintarg: MintNFTArgs = {
  tokenName: '0000'
}

callMintNFT(config, endpointParams, mintarg)
  .then(x => {
    console.log('mint success')
    console.log(x)
  })
  .catch(e => {
    console.log('mint fail')
    console.log(e)
  })

const assetClass: AssetClass = {
  currencySymbol: endpointParams.configCurrencySymbol,
  tokenName: '0000'
}

const listarg: ListNFTArgs = {
  price: BigInt(10),
  nftAssetClass: assetClass
}

callListNFT(config, endpointParams, listarg)
  .then(x => {
    console.log('list success')
    console.log(x)
  })
  .catch(e => {
    console.log('list fail')
    console.log(e)
  })

callGetPrice(config, endpointParams, assetClass)
  .then(x => {
    console.log('get price success')
    console.log(x)
  })
  .catch(e => {
    console.log('get price fail')
    console.log(e)
  })

function App() {
  return (
    <div className={styles.container}>
      <Router>
        <TopBar />
        <Routes />
      </Router>
    </div>
  );
}

export default App;
