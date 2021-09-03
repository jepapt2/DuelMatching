import { Box, Container, Tab, TabList, Tabs } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  index: number;
};

const MessageTabs: VFC<Props> = memo((props) => {
  const { index } = props;
  const history = useHistory();

  return (
    <>
      <Container position="fixed" top="0" padding="0">
        <Tabs isFitted variant="enclosed" defaultIndex={index} bg="primary">
          <TabList>
            <Tab onClick={() => history.push('/message')}>通知</Tab>
            <Tab onClick={() => history.push('/message/friend')}>フレンド</Tab>
            <Tab onClick={() => history.push('/profile/recruit')}>
              参加済みの募集
            </Tab>
          </TabList>
        </Tabs>
      </Container>
      <Box height="50px" />
    </>
  );
});
export default MessageTabs;
