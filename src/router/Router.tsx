import { memo, VFC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../components/providers/AuthContext';
import Edit from '../components/pages/Edit';
import Login from '../components/pages/Login';
import Top from '../components/pages/Top';

const Router: VFC = memo(() => (
  <Switch>
    <Route exact path="/" component={Top} />
    <AuthProvider>
      <Route path="/login" component={Login} />
      <Route path="/users/edit" component={Edit} />
    </AuthProvider>
  </Switch>
));

export default Router;
