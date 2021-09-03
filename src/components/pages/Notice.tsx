import { memo, useContext, useEffect, useState, VFC } from 'react';
import { Spinner, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { db } from '../../firebase';
import MessageTabs from '../molecules/MessageTabs';
import { AuthContext } from '../providers/AuthContext';
import Notification from '../../types/notification';
import FriendRequestNotice from '../molecules/FriendRequestNotice';
import useDateTime from '../../hooks/useDateTime';
import NewFriendNotice from '../molecules/NewFriendNotice';

const Message: VFC = memo(() => {
  const { id, name, avatar } = useContext(AuthContext);
  const [oldestId, setOldestId] = useState<string>('');
  const [messageList, setMessageList] = useState<Notification[]>([]);
  const [lastDate, setLastDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const viewDateTime = useDateTime();

  const getLast = async () => {
    setLoading(true);

    const collection = db
      .collection('users')
      .doc(id)
      .collection('notifications')
      .orderBy('updateAt', 'asc');

    const res = collection.limit(1).get();

    if ((await res).docs[0]?.id) {
      setOldestId((await res).docs[0].id);
    }

    db.collection('users')
      .doc(id)
      .collection('notifications')
      .orderBy('updateAt', 'desc')
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
      .collection('users')
      .doc(id)
      .collection('notifications')
      .orderBy('updateAt', 'desc');

    if (lastDate) {
      if (oldestId === messageList[messageList.length - 1].id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(10).get();

    const messages = res.docs.reduce<Notification[]>(
      (acc, doc) => [
        ...acc,
        {
          id: doc.id,
          type: doc.data().type as string,
          recId: doc.data().recId as string,
          recName: doc.data().recName as string,
          recAvatar: doc.data().recAvatar as string,
          read: doc.data().read as boolean,
          updateAt: viewDateTime(doc.data().updateAt),
          text: doc.data().text as string,
        },
      ],
      messageList,
    );

    db.collection('users')
      .doc(id)
      .collection('notifications')
      .orderBy('updateAt', 'desc')
      .endBefore(new Date())
      .onSnapshot((docs) => {
        docs.docChanges().forEach((change) => {
          if (change.type === 'added') {
            setMessageList((prevArray) =>
              prevArray.length
                ? [
                    {
                      id: change.doc.id,
                      type: change.doc.data().type as string,
                      recId: change.doc.data().recId as string,
                      recName: change.doc.data().recName as string,
                      recAvatar: change.doc.data().recAvatar as string,
                      read: change.doc.data().read as boolean,
                      updateAt: viewDateTime(change.doc.data().updateAt),
                      text: change.doc.data().text as string,
                    },
                    ...prevArray,
                  ]
                : [
                    {
                      id: change.doc.id,
                      type: change.doc.data().type as string,
                      recId: change.doc.data().recId as string,
                      recName: change.doc.data().recName as string,
                      recAvatar: change.doc.data().recAvatar as string,
                      read: change.doc.data().read as boolean,
                      updateAt: viewDateTime(change.doc.data().updateAt),
                      text: change.doc.data().text as string,
                    },
                  ],
            );
          }
        });
      });

    setMessageList(messages);
    if (res.docs[0]?.id) {
      setLastDate(res.docs[res.docs.length - 1].data().updateAt);
    }

    setLoading(false);
  };

  useEffect(() => {
    void getLast();
    void getMessages();

    return () => {
      void getLast();
      void getMessages();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchMessageType = (message: Notification) => {
    switch (message.type) {
      case 'friendRequest':
        return (
          <FriendRequestNotice
            key={message.id}
            id={id as string}
            name={name as string}
            avatar={avatar as string}
            recId={message.recId}
            recName={message.recName}
            recAvatar={message.recAvatar}
            read={message.read}
            updateAt={message.updateAt}
          />
        );
      default:
        return (
          <NewFriendNotice
            key={message.id}
            id={id as string}
            name={name as string}
            avatar={avatar as string}
            recId={message.recId}
            recName={message.recName}
            recAvatar={message.recAvatar}
            read={message.read}
            updateAt={message.updateAt}
          />
        );
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <MessageTabs index={0} />

          {messageList.length ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={getMessages}
              hasMore={oldestId !== messageList[messageList.length - 1].id}
            >
              <VStack spacing={4} align="stretch">
                {messageList.map((message) => switchMessageType(message))}
              </VStack>
            </InfiniteScroll>
          ) : (
            <Alert status="warning" marginTop="100px">
              <AlertIcon />
              該当するユーザはいませんでした
            </Alert>
          )}
        </>
      )}
    </>
  );
});

export default Message;
