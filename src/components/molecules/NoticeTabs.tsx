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
      <Container zIndex="1" position="fixed" top="0" padding="0">
        <Tabs isFitted variant="enclosed" defaultIndex={index}>
          <TabList bg="primary">
            <Tab onClick={() => history.push('/notice')}>通知</Tab>
            <Tab onClick={() => history.push('/friend')}>フレンド</Tab>
            <Tab onClick={() => history.push('/join')}>参加済みの募集</Tab>
          </TabList>
        </Tabs>
      </Container>
      <Box height="50px" />
    </>
  );
});
export default MessageTabs;
