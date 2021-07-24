import { memo, useContext, VFC } from 'react';
import ProfileTabs from '../molecules/ProfileTabs';
import UserProfile from '../organisms/UserProfile';
import { AuthContext } from '../providers/AuthContext';

const Profile: VFC = memo(() => {
  const userId = useContext(AuthContext).id as string;

  return (
    <>
      <ProfileTabs index={1} />
      <UserProfile userId={userId} />
    </>
  );
});

export default Profile;
