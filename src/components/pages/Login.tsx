import { Box } from '@chakra-ui/react';
import { memo, useContext, VFC } from 'react';
import { AuthContext } from '../providers/AuthContext';

const Login: VFC = memo(() => {
  const context = useContext(AuthContext);
  console.log(context.currentUser);

  return <Box>ログイン</Box>;
});

export default Login;
