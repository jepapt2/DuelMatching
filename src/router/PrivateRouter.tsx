import { memo, useContext, VFC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../components/providers/AuthContext';
import Edit from '../components/pages/Edit';
import Login from '../components/pages/Login';
import Menu from '../components/molecules/Menu';

const PrivateRouter: VFC = memo(() => {
  const currentUserId = useContext(AuthContext).currentUser;

  return (
    <>
      {!currentUserId ? (
        <Redirect to="/" />
      ) : (
        <>
          <Route path="/login" component={Login} />
          <Route path="/users/edit" component={Edit} />
          <Menu />
        </>
      )}
    </>
  );
});

export default PrivateRouter;
