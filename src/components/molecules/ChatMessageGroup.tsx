import { Avatar, Box, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';

type Props = {
  id: string;
  userId: string;
  name?: string;
  avatar?: string;
  text: string;
  createdAt: string;
};

const ChatMessageGroup: VFC<Props> = memo((props) => {
  const { id, userId, name, avatar, text, createdAt } = props;
  const history = useHistory();

  return (
    <>
      <Box
        className="chatMessagePartner"
        id={id}
        marginRight="auto"
        marginLeft="5px"
        style={{ maxWidth: '75%' }}
      >
        <Avatar
          src={avatar}
          display="inline-block"
          size="sm"
          onClick={() => history.push(`/user/${userId}`)}
          cursor="pointer"
        />
        <Text
          display="inline-block"
          fontSize="sm"
          marginLeft="3px"
          marginTop="5px"
          onClick={() => history.push(`/user/${userId}`)}
          cursor="pointer"
        >
          {name}
        </Text>

        <Box
          bg="primary"
          marginTop="5px"
          paddingY="5px"
          paddingX="8px"
          borderRadius="3xl"
          maxWidth="max-content"
        >
          {text}
        </Box>
        <Text fontSize="xs">{createdAt}</Text>
      </Box>
    </>
  );
});
export default ChatMessageGroup;
