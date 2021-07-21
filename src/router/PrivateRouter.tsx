import { memo, useContext, VFC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../components/providers/AuthContext';

import Login from '../components/pages/Login';
import Menu from '../components/molecules/Menu';

import ProfileRouter from './PriofileRouter';

const PrivateRouter: VFC = memo(() => {
  const currentUserId = useContext(AuthContext).id;

  return (
    <>
      {!currentUserId ? (
        <Redirect to="/" />
      ) : (
        <>
          <Route path="/login" component={Login} />
          {ProfileRouter.map((route) => (
            <Route
              key={route.path}
              exact={route.exact}
              path={`/profile${route.path}`}
            >
              {route.component}
            </Route>
          ))}
          <Menu />
        </>
      )}
    </>
  );
});

export default PrivateRouter;
