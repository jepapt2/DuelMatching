import { memo, useContext, VFC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../components/providers/AuthContext';
import Menu from '../components/molecules/Menu';

import ProfileRouter from './PriofileRouter';
import Users from '../components/pages/Users';
import Recruits from '../components/pages/Recruits';
import RecruitNew from '../components/pages/RecruitNew';
import RecruitPage from '../components/pages/RecruitPage';
import UserPage from '../components/pages/UserPage';
import Notice from '../components/pages/Notice';
import Friend from '../components/pages/Friend';
import Join from '../components/pages/Join';
import Chat from '../components/pages/Chat';
import GroupChat from '../components/pages/GroupChat';

const PrivateRouter: VFC = memo(() => {
  const currentUserId = useContext(AuthContext).id;

  return (
    <>
      {!currentUserId ? (
        <Redirect to="/" />
      ) : (
        <>
          <Route exact path="/users" component={Users} />
          <Route exact path="/user/:id" component={UserPage} />
          <Route exact path="/recruits" component={Recruits} />
          <Route exact path="/recruitnew" component={RecruitNew} />
          <Route path="/recruit/:id" component={RecruitPage} />
          <Route path="/notice" component={Notice} />
          <Route path="/friend" component={Friend} />
          <Route path="/join" component={Join} />
          <Route path="/chat/:roomId" component={Chat} />
          <Route path="/group/:groupId" component={GroupChat} />
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
