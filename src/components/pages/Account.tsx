import { memo, VFC } from 'react';
import ProfileTabs from '../molecules/ProfileTabs';

const Account: VFC = memo(() => (
  <>
    <ProfileTabs index={2} />
    アカウント
  </>
));

export default Account;
