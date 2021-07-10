import { Box } from '@chakra-ui/react';
import { memo, useContext, VFC } from 'react';
import { AuthContext } from '../providers/AuthContext';

const Login: VFC = memo(() => {
  const currentUserId = useContext(AuthContext).currentUser;
  console.log(currentUserId);

  return <Box>ログイン</Box>;
});

export default Login;
