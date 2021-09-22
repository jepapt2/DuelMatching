import { Avatar, Box, Flex, Spacer, Text, Divider } from '@chakra-ui/react';
import { memo, useEffect, VFC } from 'react';
import { useHistory } from 'react-router';
import { db } from '../../firebase';
import PrimaryButton from '../atom/PrimaryButton';

type Props = {
  id: string;
  name: string;
  avatar: string;
  recId: string;
  recName: string;
  recAvatar: string;
  read: boolean;
  updateAt: string;
};

const NewFriendNotice: VFC<Props> = memo((props) => {
  const { id, name, avatar, recId, recName, recAvatar, read, updateAt } = props;
  const history = useHistory();

  useEffect(() => {
    const unSub = async () => {
      await db
        .collection('users')
        .doc(id)
        .collection('notifications')
        .doc(`${recId}_newFriend`)
        .update({
          read: true,
        });
    };

    void unSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickPermission = async () => {
    await db
      .collection('chatRooms')
      .doc(`${id}_${recId}`)
      .collection('partners')
      .doc(id)
      .get()
      .then(async (first) => {
        if (first.exists) {
          history.push(`/chat/${id}_${recId}`);
        } else {
          await db
            .collection('chatRooms')
            .doc(`${recId}_${id}`)
            .collection('partners')
            .doc(id)
            .get()
            .then(async (second) => {
              if (second.exists) {
                history.push(`/chat/${recId}_${id}`);
              } else {
                await db
                  .collection('chatRooms')
                  .doc(`${id}_${recId}`)
                  .collection('partners')
                  .doc(id)
                  .set({
                    name,
                    avatar,
                  });
                await db
                  .collection('chatRooms')
                  .doc(`${id}_${recId}`)
                  .collection('partners')
                  .doc(recId)
                  .set({
                    name: recName,
                    avatar: recAvatar,
                  });
                history.push(`/chat/${id}_${recId}`);
              }
            });
        }
      });
  };

  return (
    <>
      <Box padding="5px">
        <Flex marginBottom="1">
          <Text marginBottom="1">{recName}さんとフレンド登録成立しました</Text>
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
        <Flex marginBottom="1">
          <Avatar
            src={recAvatar}
            onClick={() => history.push(`/user/${recId}`)}
            cursor="pointer"
            display="inline-block"
          />
          <Spacer />
          <PrimaryButton onClick={onClickPermission}>
            メッセージを送る
          </PrimaryButton>
        </Flex>

        <Text fontSize="sm">{updateAt}</Text>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default NewFriendNotice;
