import { Route, Switch } from "react-router-dom";
import Onboarding from "../pages/Onboarding";
import Wallets from "../pages/Wallets";
import Marketplace from "../pages/Marketplace";
import Home from "../pages/PlayerProfile/Home";
import EditProfile from '../pages/PlayerProfile/EditProfile';
import Mint from "../pages/Mint";
import Leaderboard from '../pages/Leaderboard';
import {Nft} from '../pages/Nft';

function Routes() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Onboarding}/>
        <Route exact path="/profile" component={Home}/>
        <Route exact path="/profile/edit" component={EditProfile}/>
        <Route exact path="/marketplace" component={Marketplace}/>
        <Route exact path="/mint" component={Mint} />
        <Route exact path="/marketplace/:nftId" component={Nft}/>
        <Route exact path="/leaderboard" component={Leaderboard}/>
        <Route path="/wallets" component={Wallets} />
      </Switch>
    </div>
  );
}

export default Routes;
