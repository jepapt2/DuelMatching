import { memo, VFC } from 'react';
import PrimaryButton from '../atom/PrimaryButton';
import { useLogout } from '../../hooks/useLoginUser';

const Login: VFC = memo(() => {
  const logout = useLogout();

  return <PrimaryButton onClick={logout}>ログアウト</PrimaryButton>;
});

export default Login;
