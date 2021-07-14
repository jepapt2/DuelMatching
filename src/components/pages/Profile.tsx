import { memo, VFC } from 'react';

import ProfileTabs from '../molecules/ProfileTabs';

const Profile: VFC = memo(() => (
  <>
    <ProfileTabs index={1} />
    プロフィール
  </>
));

export default Profile;
