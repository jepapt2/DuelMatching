import { ChatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Button,
} from '@chakra-ui/react';
import { memo, VFC } from 'react';
import { useHistory } from 'react-router';
import { db } from '../../firebase';

type Props = {
  id: string;
  name: string;
  avatar: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  comment?: string;
};

const FriendCard: VFC<Props> = memo((props) => {
  const { id, name, avatar, friendId, friendName, friendAvatar, comment } =
    props;
  const history = useHistory();

  const onClickMessage = async () => {
    await db
      .collection('chatRooms')
      .doc(`${id}_${friendId}`)
      .collection('partners')
      .doc(id)
      .get()
      .then(async (first) => {
        if (first.exists) {
          history.push(`/chat/${id}_${friendId}`);
        } else {
          await db
            .collection('chatRooms')
            .doc(`${friendId}_${id}`)
            .collection('partners')
            .doc(id)
            .get()
            .then(async (second) => {
              if (second.exists) {
                history.push(`/chat/${friendId}_${id}`);
              } else {
                await db
                  .collection('chatRooms')
                  .doc(`${id}_${friendId}`)
                  .collection('partners')
                  .doc(id)
                  .set({
                    name,
                    avatar,
                    uid: id,
                  });
                await db
                  .collection('chatRooms')
                  .doc(`${id}_${friendId}`)
                  .collection('partners')
                  .doc(friendId)
                  .set({
                    name: friendName,
                    avatar: friendAvatar,
                    uid: friendId,
                  });
                history.push(`/chat/${id}_${friendId}`);
              }
            });
        }
      });
  };

  return (
    <>
      <Box padding="5px">
        <Flex marginBottom="1" wrap="wrap" justify="flex-end">
          <Avatar
            src={friendAvatar}
            onClick={() => history.push(`/user/${friendId}`)}
            cursor="pointer"
            display="inline-block"
          />
          <Box marginTop="10px" marginLeft="5px">
            <Text fontSize="lg" fontWeight="bold" color="head">
              {friendName}
            </Text>
            <Text>{comment}</Text>
          </Box>
          <Spacer />
          <Button
            marginTop="7px"
            bg="link"
            color="primary"
            onClick={onClickMessage}
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
export default FriendCard;
