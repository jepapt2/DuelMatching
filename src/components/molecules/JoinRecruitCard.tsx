import firebase from 'firebase';
import { ChatIcon, Icon } from '@chakra-ui/icons';
import { Box, Text, Divider, Button, Flex, Spacer } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';
import { RiFileTextFill } from 'react-icons/ri';

type Props = {
  id: string;
  title?: string;
  start: firebase.firestore.Timestamp;
  limit: firebase.firestore.Timestamp;
  cancel?: boolean;
};

const JoinRecruitCard: VFC<Props> = memo((props) => {
  const { id, title, start, limit, cancel } = props;
  const history = useHistory();

  return (
    <>
      <Box padding="5px">
        <Flex marginBottom="1" wrap="wrap" justify="flex-end">
          <Box marginLeft="5px">
            <Text fontSize="lg" fontWeight="bold" color="head">
              {title}
            </Text>
            {cancel ? (
              <Text>この募集はキャンセルされました</Text>
            ) : (
              <>
                <Text display="inline-block" marginRight="10px">
                  {limit.toDate().getTime() < new Date().getTime()
                    ? '募集終了'
                    : '募集中'}
                </Text>
                <Text display="inline-block" marginRight="10px">
                  {start.toDate().getTime() < new Date().getTime()
                    ? '開催終了'
                    : '未開催'}
                </Text>
              </>
            )}
          </Box>
          <Spacer />
          <Button
            marginTop="7px"
            marginRight="18px"
            bg="link"
            color="primary"
            onClick={() => history.push(`/recruit/${id}`)}
            type="submit"
            _active={{
              bg: 'link',
              transform: 'scale(0.98)',
            }}
            _focus={{
              bg: 'link',
            }}
            _hover={{
              bg: 'link',
            }}
          >
            <Icon as={RiFileTextFill} h="18px" w="18px" color="primary" />
          </Button>
          <Button
            marginTop="7px"
            bg="link"
            color="primary"
            onClick={() => history.push(`/group/${id}`)}
            type="submit"
            _active={{
              bg: 'link',
              transform: 'scale(0.98)',
            }}
            _focus={{
              bg: 'link',
            }}
            _hover={{
              bg: 'link',
            }}
          >
            <ChatIcon />
          </Button>
        </Flex>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default JoinRecruitCard;
