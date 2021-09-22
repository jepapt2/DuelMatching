import { Box, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  id: string;
  text: string;
  createdAt: string;
};

const ChatMessagePartner: VFC<Props> = memo((props) => {
  const { id, text, createdAt } = props;

  return (
    <>
      <Box
        className="chatMessagePartner"
        id={id}
        marginRight="auto"
        marginLeft="5px"
        style={{ maxWidth: '75%' }}
      >
        <Box
          bg="primary"
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
export default ChatMessagePartner;
