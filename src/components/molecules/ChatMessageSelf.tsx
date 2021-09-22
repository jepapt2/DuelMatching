import { Box, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  text: string;
  createdAt: string;
};

const ChatMessageSelf: VFC<Props> = memo((props) => {
  const { text, createdAt } = props;

  return (
    <>
      <Box
        maxWidth="fit-content"
        marginLeft="auto"
        marginRight="5px"
        style={{ maxWidth: '75%' }}
      >
        <Box
          bg="link"
          paddingY="5px"
          paddingX="8px"
          borderRadius="3xl"
          maxWidth="max-content"
          marginLeft="auto"
        >
          {text}
        </Box>
        <Text fontSize="xs" textAlign="right">
          {createdAt}
        </Text>
      </Box>
    </>
  );
});
export default ChatMessageSelf;
