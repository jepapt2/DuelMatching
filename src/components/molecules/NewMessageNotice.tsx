import { Avatar, Box, Flex, Spacer, Text, Divider } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';

type Props = {
  text?: string;
  recId: string;
  recName: string;
  recAvatar: string;
  read: boolean;
  updateAt: string;
  roomId?: string;
};

const NewMessageNotice: VFC<Props> = memo((props) => {
  const { text, recId, recName, recAvatar, read, updateAt, roomId } = props;
  const history = useHistory();

  return (
    <>
      <Box
        padding="5px"
        onClick={() => history.push(`/chat/${roomId as string}`)}
      >
        <Flex marginBottom="1">
          <Avatar
            src={recAvatar}
            onClick={() => history.push(`/user/${recId}`)}
            cursor="pointer"
            display="inline-block"
          />
          <Text marginBottom="1">{recName}</Text>
          {!read && (
            <>
              <Spacer />
              <Box
                borderRadius="full"
                bg="link"
                height="15px"
                width="15px"
                marginLeft="auto"
              />
            </>
          )}
        </Flex>
        <Text>{text}</Text>

        <Text fontSize="sm">{updateAt}</Text>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default NewMessageNotice;
