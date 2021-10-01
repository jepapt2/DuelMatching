/* eslint-disable react/jsx-props-no-spreading */
import { memo, useContext, useEffect, useRef, useState, VFC } from 'react';
import {
  Text,
  Spinner,
  Stack,
  Box,
  Container,
  FormControl,
  Input,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Avatar,
  Spacer,
} from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ArrowBackIcon, Icon } from '@chakra-ui/icons';
import { IoSend } from 'react-icons/io5';
import { db } from '../../firebase';
import { AuthContext } from '../providers/AuthContext';
import ChatType from '../../types/chat';
import Member from '../../types/member';
import useDateTime from '../../hooks/useDateTime';
import ChatMessageSelf from '../molecules/ChatMessageSelf';
import ChatMessagePartner from '../molecules/ChatMessagePartner';

const Chat: VFC = memo(() => {
  const { id } = useContext(AuthContext);
  const [partners, setPartners] = useState<Member[]>([]);
  const [oldestId, setOldestId] = useState<string>('');
  const [messageList, setMessageList] = useState<ChatType[]>([]);
  const [lastDate, setLastDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [partnerCheck, setPartnerCheck] = useState<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  const viewDateTime = useDateTime();
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChatType>({ shouldUnregister: false });

  const getPartners = async () => {
    const partnersCollection = await db
      .collection('chatRooms')
      .doc(roomId)
      .collection('partners')
      .get();

    const partnersList = partnersCollection.docs.map<Member>((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
      avatar: doc.data().avatar as string,
    }));

    setPartners(partnersList);

    setPartnerCheck(partnersList.some((user) => user.id === id));
  };

  const setRead = async () => {
    await db
      .collection('users')
      .doc(id)
      .collection('notifications')
      .doc(`${roomId}_newMessage`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          void db
            .collection('users')
            .doc(id)
            .collection('notifications')
            .doc(`${roomId}_newMessage`)
            .update({
              read: true,
            });
        }
      });
  };

  const getLast = async () => {
    const collection = db
      .collection('chatRooms')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'asc');

    const res = collection.limit(1).get();

    if ((await res).docs[0]?.id) {
      setOldestId((await res).docs[0].id);
    }

    db.collection('chatRooms')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .endBefore(new Date())
      .onSnapshot((docs) => {
        docs.docChanges().forEach((change) => {
          if (change.type === 'added') {
            setOldestId((prevId) => prevId || change.doc.id);
          }
        });
      });
  };

  const getMessages = async () => {
    let collection = db
      .collection('chatRooms')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'desc');

    if (lastDate) {
      if (oldestId === messageList[messageList.length - 1].id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(20).get();

    const messages = res.docs.reduce<ChatType[]>(
      (acc, doc) => [
        ...acc,
        {
          id: doc.id,
          userId: doc.data().userId as string,
          text: doc.data().text as string,
          createdAt: viewDateTime(doc.data().createdAt),
        },
      ],
      messageList,
    );

    db.collection('chatRooms')
      .doc(roomId)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .endBefore(new Date())
      .onSnapshot((docs) => {
        docs.docChanges().forEach((change) => {
          if (change.type === 'added') {
            setMessageList((prevArray) =>
              prevArray.length
                ? [
                    {
                      id: change.doc.id,
                      userId: change.doc.data().userId as string,
                      text: change.doc.data().text as string,
                      createdAt: viewDateTime(change.doc.data().createdAt),
                    },
                    ...prevArray,
                  ]
                : [
                    {
                      id: change.doc.id,
                      userId: change.doc.data().userId as string,
                      text: change.doc.data().text as string,
                      createdAt: viewDateTime(change.doc.data().createdAt),
                    },
                  ],
            );
            scrollBottomRef.current?.scrollIntoView();
          }
        });
      });

    setMessageList(messages);
    if (res.docs[0]?.id) {
      setLastDate(res.docs[res.docs.length - 1].data().createdAt);
    }

    setLoading(false);
  };

  useEffect(() => {
    void getPartners();
    void setRead();
    void getLast();
    void getMessages();

    return () => {
      void getPartners();
      void setRead();
      void getLast();
      void getMessages();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unSub = () => scrollBottomRef.current?.scrollIntoView();

    return () => {
      unSub();
    };
  }, [loading]);

  const chatUserProfile = (messageUserId?: string) => {
    const userProfile = partners.find((user) => user.id !== messageUserId);

    return userProfile;
  };

  const switchChatMessageType = (message: ChatType) => {
    switch (message.userId) {
      case id:
        return (
          <ChatMessageSelf
            key={message.id}
            text={message.text}
            createdAt={message.createdAt}
          />
        );
      default:
        return (
          <ChatMessagePartner
            key={message.id}
            id={message.id}
            text={message.text}
            createdAt={message.createdAt}
          />
        );
    }
  };

  const onSubmit: SubmitHandler<ChatType> = async (data) => {
    await db.collection('chatRooms').doc(roomId).collection('chat').add({
      userId: id,
      text: data.text,
      createdAt: new Date(),
    });
    reset();
  };

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          {partnerCheck ? (
            <>
              <Container
                p={0}
                position="fixed"
                top="0"
                borderColor="head"
                bg="primary"
              >
                <Flex>
                  <Icon
                    as={ArrowBackIcon}
                    boxSize="50px"
                    color="link"
                    onClick={() => history.goBack()}
                    cursor="pointer"
                    display="inline-block"
                  />
                  <Spacer />
                  <Box marginRight="70px">
                    <Avatar
                      src={chatUserProfile(id)?.avatar}
                      onClick={() =>
                        history.push(
                          `/user/${chatUserProfile(id)?.id as string}`,
                        )
                      }
                      cursor="pointer"
                      display="inline-block"
                    />
                    <Text
                      marginLeft="5px"
                      marginTop="11px"
                      fontWeight="semibold"
                      fontSize="lg"
                      onClick={() =>
                        history.push(
                          `/user/${chatUserProfile(id)?.id as string}`,
                        )
                      }
                      cursor="pointer"
                      display="inline-block"
                    >
                      {chatUserProfile(id)?.name}
                    </Text>
                  </Box>

                  <Spacer />
                </Flex>
              </Container>
              {messageList.length ? (
                <>
                  <InfiniteScroll
                    isReverse
                    pageStart={0}
                    loadMore={getMessages}
                    initialLoad={false}
                    hasMore={
                      oldestId !== messageList[messageList.length - 1].id
                    }
                  >
                    <Stack
                      spacing={4}
                      direction="column-reverse"
                      bg="secondary"
                      shouldWrapChildren
                      paddingTop="60px"
                    >
                      {messageList.map((message) =>
                        switchChatMessageType(message),
                      )}
                    </Stack>
                  </InfiniteScroll>
                  <Box height="110px" />
                </>
              ) : (
                <></>
              )}
              <Container
                p={0}
                position="fixed"
                bottom="50px"
                borderTopColor="head"
                bg="primary"
                style={{ zIndex: 1 }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Flex>
                    <FormControl isInvalid={!!errors.text}>
                      <Popover
                        returnFocusOnClose={false}
                        isOpen={errors.text?.type === 'maxLength'}
                        placement="top"
                        closeOnBlur={false}
                      >
                        <PopoverTrigger>
                          <Input
                            marginY="8px"
                            display="inline-block"
                            bg="primary"
                            id="text"
                            {...register('text', {
                              required: '入力してください',
                              maxLength: {
                                value: 500,
                                message: '送信できるテキストは500文字までです',
                              },
                            })}
                          />
                        </PopoverTrigger>
                        <PopoverContent width="320px">
                          <PopoverHeader fontWeight="semibold">
                            {errors.text?.message}
                          </PopoverHeader>
                          <PopoverArrow />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <Button
                      marginY="7px"
                      marginLeft="5px"
                      display="inline-block"
                      bg="primary"
                      color="link"
                      isLoading={isSubmitting}
                      type="submit"
                      _active={{
                        bg: 'primary',
                      }}
                      _focus={{
                        bg: 'primary',
                      }}
                      _hover={{
                        bg: 'primary',
                      }}
                    >
                      <Icon as={IoSend} w={7} h={7} />
                    </Button>
                  </Flex>
                </form>
              </Container>
            </>
          ) : (
            <Redirect to="/notice" />
          )}
        </>
      )}
      <Box position="absolute" bottom="0" height="10px" ref={scrollBottomRef} />
    </>
  );
});

export default Chat;
