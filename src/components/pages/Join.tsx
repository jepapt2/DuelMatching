import { memo, useContext, useEffect, useState, VFC } from 'react';
import { Spinner, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import firebase from 'firebase';
import { db } from '../../firebase';
import NoticeTabs from '../molecules/NoticeTabs';
import { AuthContext } from '../providers/AuthContext';
import JoinType from '../../types/joinType';
import JoinRecruitCard from '../molecules/JoinRecruitCard';

const Join: VFC = memo(() => {
  const { id } = useContext(AuthContext);
  const [oldestId, setOldestId] = useState<string>('');
  const [recruitList, setRecruitList] = useState<JoinType[]>([]);
  const [lastDate, setLastDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getLast = async () => {
    setLoading(true);

    const collection = db
      .collectionGroup('members')
      .orderBy('createdAt', 'asc')
      .where('uid', '==', id);

    const res = await (
      await collection.limit(1).get()
    ).docs[0]?.ref.parent.parent?.get();

    if (res?.id) {
      setOldestId(res.id);
    }
  };

  const getFriends = async () => {
    let collection = db
      .collectionGroup('members')
      .orderBy('createdAt', 'desc')
      .where('uid', '==', id);

    if (lastDate) {
      if (oldestId === recruitList[recruitList.length - 1].id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(10).get();

    const resParent = await Promise.all(
      res.docs.map((doc) => doc.ref.parent.parent?.get()),
    );

    const recruits = resParent.reduce<JoinType[]>(
      (acc, doc) => [
        ...acc,
        {
          id: doc?.id as string,
          title: doc?.data()?.title as string,
          start: doc?.data()?.start as firebase.firestore.Timestamp,
          limit: doc?.data()?.limit as firebase.firestore.Timestamp,
          cancel: doc?.data()?.cancel as boolean,
        },
      ],
      recruitList,
    );

    setRecruitList(recruits);
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
          <NoticeTabs index={2} />

          {recruitList.length ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={getFriends}
              hasMore={oldestId !== recruitList[recruitList.length - 1].id}
            >
              <VStack spacing={4} align="stretch">
                {recruitList.map((recruit) => (
                  <JoinRecruitCard
                    key={recruit.id}
                    id={recruit.id}
                    title={recruit.title}
                    start={recruit.start}
                    limit={recruit.limit}
                    cancel={recruit.cancel}
                  />
                ))}
              </VStack>
            </InfiniteScroll>
          ) : (
            <Alert status="warning" marginTop="100px">
              <AlertIcon />
              参加した募集はまだありません
            </Alert>
          )}
        </>
      )}
    </>
  );
});

export default Join;
