import Account from '../components/pages/Account';
import Edit from '../components/pages/Edit';
import Profile from '../components/pages/Profile';

const ProfileRouter = [
  {
    path: '/',
    exact: true,
    component: <Profile />,
  },
  {
    path: '/edit',
    exact: false,
    component: <Edit />,
  },
  {
    path: '/account',
    exact: false,
    component: <Account />,
  },
];

export default ProfileRouter;
