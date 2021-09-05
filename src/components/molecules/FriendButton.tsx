import {
  VStack,
  Icon,
  Text,
  AlertStatus,
  useToast,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { useState, memo, useEffect, VFC } from 'react';

import { FaUserMinus, FaUserPlus } from 'react-icons/fa';
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
  const [loading, setLoading] = useState<boolean>(true);
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
    setLoading(false);
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

  const onClickFriendDelete = async () => {
    let toastTitle = 'フレンドから削除しました';
    let toastStatus: AlertStatus = 'success';
    try {
      await db
        .collection('users')
        .doc(sendId)
        .collection('friends')
        .doc(recId)
        .delete();

      await db
        .collection('users')
        .doc(recId)
        .collection('friends')
        .doc(sendId)
        .delete();
    } catch {
      toastTitle = 'フレンド削除に失敗しました';
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

  const renderButton = () => {
    if (sendId === recId) {
      return <></>;
    }
    if (register) {
      return (
        <Popover>
          <PopoverTrigger>
            <VStack
              spacing={0}
              align="center"
              marginRight="5px"
              marginTop="5px"
              cursor="pointer"
              color="link"
              bg="link"
              border="2px"
              borderRadius="xl"
              padding="2px"
            >
              <Icon
                as={FaUserMinus}
                boxSize="25px"
                color="primary"
                display="inline-block"
                marginLeft="8px"
              />
              <Text fontSize="6px" color="primary" paddingBottom="0">
                フレンド削除
              </Text>
            </VStack>
          </PopoverTrigger>
          <PopoverContent width="220px">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="center">
              本当に削除しますか？
            </PopoverHeader>
            <PopoverBody textAlign="center">
              <Button
                display="inline-block"
                colorScheme="red"
                onClick={onClickFriendDelete}
              >
                削除する
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <VStack
        spacing={0}
        align="center"
        marginRight="5px"
        marginTop="5px"
        onClick={onClickFriendCreate}
        cursor="pointer"
        color="link"
        bg="primary"
        border="2px"
        borderRadius="xl"
        padding="2px"
      >
        <Icon
          as={FaUserPlus}
          boxSize="25px"
          color="link"
          display="inline-block"
          marginLeft="8px"
        />
        <Text fontSize="6px" color="link">
          フレンド申請
        </Text>
      </VStack>
    );
  };

  return (
    <>
      {loading ? (
        <Spinner marginY="auto" marginRight="20px" textAlign="center" />
      ) : (
        renderButton()
      )}
    </>
  );
});
export default FriendButton;
