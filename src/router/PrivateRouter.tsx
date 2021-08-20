import { memo, useContext, VFC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../components/providers/AuthContext';

import Login from '../components/pages/Login';
import Menu from '../components/molecules/Menu';

import ProfileRouter from './PriofileRouter';
import Users from '../components/pages/Users';
import Recruits from '../components/pages/Recruits';
import RecruitNew from '../components/pages/RecruitNew';
import RecruitPage from '../components/pages/RecruitPage';

const PrivateRouter: VFC = memo(() => {
  const currentUserId = useContext(AuthContext).id;

  return (
    <>
      {!currentUserId ? (
        <Redirect to="/" />
      ) : (
        <>
          <Route path="/login" component={Login} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/recruits" component={Recruits} />
          <Route exact path="/recruitnew" component={RecruitNew} />
          <Route path="/recruit/:id" component={RecruitPage} />
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
