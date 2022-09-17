import {Route, Switch} from 'react-router-dom';
import {Connect} from './Connect';
import {Congratulations} from './Congratulations';
import {GetPaid} from './GetPaid';
import {Helmet} from 'react-helmet';

const Wallets = () => (
  <>
    <Helmet>
      <title>PlayerMint - Get Paid to Play</title>
    </Helmet>
    <Switch>
      <Route exact path="/wallets/connect" component={Connect}/>
      <Route exact path="/wallets/congratulations" component={Congratulations}/>
      <Route exact path="/wallets/get-paid" component={GetPaid}/>
    </Switch>
  </>
)

export default Wallets;
