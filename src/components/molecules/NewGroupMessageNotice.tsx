import { Box, Flex, Spacer, Text, Divider, Icon } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';
import { GiPlainCircle } from 'react-icons/gi';

type Props = {
  text?: string;
  recName: string;
  read: boolean;
  updateAt: string;
  roomId: string;
};

const NewGroupMessageNotice: VFC<Props> = memo((props) => {
  const { text, recName, read, updateAt, roomId } = props;
  const history = useHistory();

  return (
    <>
      <Box
        paddingY="5px"
        paddingX="10px"
        cursor="pointer"
        onClick={() => history.push(`/group/${roomId}`)}
      >
        <Flex marginBottom="2">
          <Box marginLeft="1">
            <Text fontWeight="semibold">{recName}</Text>
            <Text color="gray.600">
              {text && text.length > 45 ? `${text.substr(0, 45)}...` : text}
            </Text>
          </Box>

          {!read && (
            <>
              <Spacer />
              <Icon as={GiPlainCircle} color="link" />
            </>
          )}
        </Flex>

        <Text fontSize="sm">{updateAt}</Text>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default NewGroupMessageNotice;
