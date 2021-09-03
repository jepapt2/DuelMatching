import { VStack, Icon, Text, AlertStatus, useToast } from '@chakra-ui/react';
import { useState, memo, useEffect, VFC } from 'react';

import { FaUserPlus } from 'react-icons/fa';
import { db } from '../../firebase';

type Props = {
  sendId?: string;
  sendName?: string;
  sendAvatar?: string;
  recId?: string;
};

const FriendButton: VFC<Props> = memo((props) => {
  const { sendId, sendName, sendAvatar, recId } = props;
  const [register, setRegister] = useState<boolean>(true);
  const toast = useToast();

  const friendRegister = async () => {
    await db
      .collection('users')
      .doc(sendId)
      .collection('friends')
      .doc(recId)
      .get()
      .then((doc) => {
        setRegister(doc.exists);
      });
  };

  useEffect(() => {
    void friendRegister();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickFriendCreate = async () => {
    let toastTitle = 'フレンド申請しました';
    let toastStatus: AlertStatus = 'success';
    try {
      await db
        .collection('requests')
        .doc(`${sendId as string}_${recId as string}`)
        .set({
          sendId,
          sendName,
          sendAvatar,
          recId,
          updateAt: new Date(),
        });
    } catch {
      toastTitle = 'フレンド申請に失敗しました';
      toastStatus = 'error';
    } finally {
      toast({
        title: toastTitle,
        status: toastStatus,
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  console.log(register);

  return (
    <>
      {sendId === recId || register ? (
        <></>
      ) : (
        <VStack
          spacing={0}
          align="center"
          marginRight="5px"
          marginTop="5px"
          onClick={onClickFriendCreate}
          cursor="pointer"
        >
          <Icon
            as={FaUserPlus}
            boxSize="35px"
            color="link"
            display="inline-block"
            marginLeft="14px"
          />
          <Text fontSize="xs" color="link">
            フレンド申請
          </Text>
        </VStack>
      )}
    </>
  );
});
export default FriendButton;
