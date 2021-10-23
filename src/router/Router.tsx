import { memo, VFC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../components/providers/AuthContext';
import PrivateRouter from './PrivateRouter';
import Top from '../components/pages/Top';
import Tos from '../components/pages/Tos';
import Policie from '../components/pages/Policie';

const Router: VFC = memo(() => (
  <Switch>
    <Route exact path="/" component={Top} />
    <Route path="/tos" component={Tos} />
    <Route exact path="/policie" component={Policie} />
    <AuthProvider>
      <PrivateRouter />
    </AuthProvider>
  </Switch>
));

export default Router;
