import { Center } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useLogout } from '../../hooks/useLoginUser';
import PrimaryButton from '../atom/PrimaryButton';
import ProfileTabs from '../molecules/ProfileTabs';

const Account: VFC = memo(() => {
  const logout = useLogout();

  return (
    <>
      <ProfileTabs index={2} />
      <Center marginTop="50px">
        <PrimaryButton onClick={logout}>ログアウト</PrimaryButton>
      </Center>
    </>
  );
});

export default Account;
