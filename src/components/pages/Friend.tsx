import { memo, useContext, useEffect, useState, VFC } from 'react';
import { Spinner, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import { db } from '../../firebase';
import NoticeTabs from '../molecules/NoticeTabs';
import { AuthContext } from '../providers/AuthContext';
import FriendType from '../../types/friendType';
import FriendCard from '../molecules/FriendCard';

const Friend: VFC = memo(() => {
  const { id, name, avatar } = useContext(AuthContext);
  const [oldestId, setOldestId] = useState<string>('');
  const [friendList, setFriendList] = useState<FriendType[]>([]);
  const [lastDate, setLastDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getLast = async () => {
    setLoading(true);

    const collection = db
      .collection('users')
      .doc(id)
      .collection('friends')
      .orderBy('createdAt', 'asc');

    const res = collection.limit(1).get();

    if ((await res).docs[0]?.id) {
      setOldestId((await res).docs[0].id);
    }
  };

  const getFriends = async () => {
    let collection = db
      .collection('users')
      .doc(id)
      .collection('friends')
      .orderBy('createdAt', 'desc');

    if (lastDate) {
      if (oldestId === friendList[friendList.length - 1].id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(10).get();

    const friends = res.docs.reduce<FriendType[]>(
      (acc, doc) => [
        ...acc,
        {
          id: doc.id,
          name: doc.data().name as string,
          avatar: doc.data().avatar as string,
        },
      ],
      friendList,
    );

    const friendsComment = await Promise.all(
      friends.map(async (friend) => {
        const get = await db.collection('users').doc(friend.id).get();
        const newFriend = {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          comment: get.data()?.comment as string,
        };

        return newFriend;
      }),
    );

    setFriendList(friendsComment);
    if (res.docs[0]?.id) {
      setLastDate(res.docs[res.docs.length - 1].data().createdAt);
    }

    setLoading(false);
  };

  useEffect(() => {
    void getLast();
    void getFriends();

    return () => {
      void getLast();
      void getFriends();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <NoticeTabs index={1} />

          {friendList.length ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={getFriends}
              hasMore={oldestId !== friendList[friendList.length - 1].id}
            >
              <VStack spacing={4} align="stretch">
                {friendList.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    id={id as string}
                    name={name as string}
                    avatar={avatar as string}
                    friendId={friend.id}
                    friendName={friend.name}
                    friendAvatar={friend.avatar}
                    comment={friend.comment}
                  />
                ))}
              </VStack>
            </InfiniteScroll>
          ) : (
            <Alert status="warning" marginTop="100px">
              <AlertIcon />
              フレンドはまだいません
            </Alert>
          )}
        </>
      )}
    </>
  );
});

export default Friend;
