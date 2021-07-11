import { memo, VFC } from 'react';
import { Box } from '@chakra-ui/react';
import PrimaryButton from '../atom/PrimaryButton';
import { useLogout } from '../../hooks/useLoginUser';

const Login: VFC = memo(() => {
  const logout = useLogout();

  return (
    <>
      <PrimaryButton onClick={logout}>ログアウト</PrimaryButton>
      <Box height="10000px" bg="blue" />
    </>
  );
});

export default Login;
