import { Avatar, Box, Flex, Spacer, Text, Divider } from '@chakra-ui/react';
import { useState, memo, useEffect, VFC } from 'react';

import { useHistory } from 'react-router';
import { db } from '../../firebase';
import PrimaryButton from '../atom/PrimaryButton';
import SecondaryButton from '../atom/SecondaryButton';

type Props = {
  id: string;
  recId: string;
  recName: string;
  recAvatar: string;
  updateAt: string;
};

const FriendRequestNotice: VFC<Props> = memo((props) => {
  const { id, recId, recName, recAvatar, updateAt } = props;
  const [display, setDisplay] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    const unSub = async () => {
      await db
        .collection('users')
        .doc(id)
        .collection('notifications')
        .doc(`${recId}_friendReq`)
        .update({
          read: true,
        });
    };

    void unSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickPermission = async () => {
    await db.collection('requests').doc(`${recId}_${id}`).update({
      permission: true,
    });
    setDisplay(false);
  };

  const onClickRejection = async () => {
    setDisplay(false);
    await db.collection('requests').doc(`${recId}_${id}`).update({
      rejection: true,
    });
  };

  return (
    <>
      {display && (
        <>
          <Box padding="5px">
            <Text marginBottom="1">{recName}さんからのフレンド申請です</Text>
            <Flex marginBottom="1">
              <Avatar
                src={recAvatar}
                onClick={() => history.push(`/user/${recId}`)}
                cursor="pointer"
                display="inline-block"
              />
              <Spacer />
              <PrimaryButton onClick={onClickPermission}>
                許可する
              </PrimaryButton>
              <Box width="2" />
              <SecondaryButton onClick={onClickRejection}>
                拒否する
              </SecondaryButton>
            </Flex>

            <Text fontSize="sm">{updateAt}</Text>
          </Box>
          <Divider borderColor="secondary" />
        </>
      )}
    </>
  );
});
export default FriendRequestNotice;
