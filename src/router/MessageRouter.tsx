import Account from '../components/pages/Account';
import Edit from '../components/pages/Edit';
import Message from '../components/pages/Notice';

const MessageRouter = [
  {
    path: '/',
    exact: true,
    component: <Message />,
  },
  {
    path: '/friend',
    exact: false,
    component: <Edit />,
  },
  {
    path: '/recruit',
    exact: false,
    component: <Account />,
  },
];

export default MessageRouter;
