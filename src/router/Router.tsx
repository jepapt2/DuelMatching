import { memo, VFC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../components/providers/AuthContext';
import PrivateRouter from './PrivateRouter';
import Top from '../components/pages/Top';

const Router: VFC = memo(() => (
  <Switch>
    <Route exact path="/" component={Top} />
    <AuthProvider>
      <PrivateRouter />
    </AuthProvider>
  </Switch>
));

export default Router;
