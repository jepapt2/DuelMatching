import { Tab, TabList, Tabs } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  index: number;
};

const ProfileTabs: VFC<Props> = memo((props) => {
  const { index } = props;
  const history = useHistory();

  return (
    <Tabs isFitted variant="enclosed" defaultIndex={index}>
      <TabList>
        <Tab onClick={() => history.push('/profile/edit')}>編集</Tab>
        <Tab onClick={() => history.push('/profile')}>確認</Tab>
        <Tab onClick={() => history.push('/profile/account')}>アカウント</Tab>
      </TabList>
    </Tabs>
  );
});
export default ProfileTabs;
