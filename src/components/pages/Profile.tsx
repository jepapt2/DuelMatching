import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useRouteMatch, useHistory, Route } from 'react-router-dom';
import Account from './Account';
import Edit from './Edit';
import User from './User';

const Profile: VFC = memo(() => {
  const match = useRouteMatch();
  const history = useHistory();

  return (
    <Tabs isFitted variant="enclosed">
      <TabList>
        <Tab onClick={() => history.push(`${match.url}/edit`)}>編集</Tab>
        <Tab onClick={() => history.push(`${match.url}/user`)}>確認</Tab>
        <Tab onClick={() => history.push(`${match.url}/account`)}>
          アカウント
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Route path={`${match.path}/edit`} component={Edit} />
        </TabPanel>
        <TabPanel>
          <Route path={`${match.path}/user`} component={User} />
        </TabPanel>
        <TabPanel>
          <Route path={`${match.path}/account`} component={Account} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
});

export default Profile;
