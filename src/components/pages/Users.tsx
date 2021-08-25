/* eslint-disable react/jsx-props-no-spreading */
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Spinner,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Container,
  SimpleGrid,
  Select,
  Button,
  Input,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  Icon,
} from '@chakra-ui/react';
import { memo, useContext, useEffect, useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroller';
import { db } from '../../firebase';
import PlayTitle from '../../types/playTitle';
import User from '../../types/user';
import SelectAdress from '../atom/SelectAdress';
import UserCard from '../molecules/UserCard';

import UserProfile from '../organisms/UserProfile';
import { AuthContext } from '../providers/AuthContext';

const Users: VFC = memo(() => {
  const { adress, playTitle } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userList, setUserList] = useState<User[]>([]);
  const [oldestId, setOldestId] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [openId, setOpenId] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<User>({});

  const { handleSubmit, register } = useForm<User>({ shouldUnregister: false });

  const getLast = async () => {
    setLoading(true);

    let collection = db.collection('users').orderBy('createdAt', 'asc');

    if (searchValue.name) {
      collection = db
        .collection('users')
        .orderBy('name')
        .orderBy('createdAt', 'asc')
        .startAt(searchValue.name)
        .endAt(`${searchValue.name}\uf8ff`);
    }
    if (searchValue.playTitle) {
      collection = collection.where(
        'playTitle',
        'array-contains',
        searchValue.playTitle,
      );
    }

    if (searchValue.adress) {
      collection = collection.where('adress', '==', searchValue.adress);
    }

    const res = collection.limit(1).get();

    if ((await res).docs[0]?.id) {
      setOldestId((await res).docs[0].id);
    }
  };

  const getUsers = async () => {
    let collection = db.collection('users').orderBy('createdAt', 'desc');

    if (searchValue.name) {
      collection = db
        .collection('users')
        .orderBy('name')
        .orderBy('createdAt', 'desc')
        .startAt(searchValue.name)
        .endAt(`${searchValue.name}\uf8ff`);
    }

    if (searchValue.playTitle) {
      collection = collection.where(
        'playTitle',
        'array-contains',
        searchValue.playTitle,
      );
    }

    if (searchValue.adress) {
      collection = collection.where('adress', '==', searchValue.adress);
    }

    if (lastDate) {
      if (oldestId === userList[userList.length - 1].id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(10).get();

    const users = res.docs.reduce(
      (acc, doc) => [
        ...acc,
        {
          id: doc.id,
          name: doc.data().name as string,
          avatar: doc.data().avatar as string,
          playTitle: doc.data().playTitle as PlayTitle[],
          adress: doc.data().adress as string,
          favorite: doc.data().favorite as string,
          activityDay: doc.data().activityDay as string,
          activityTime: doc.data().activityTime as string,
          comment: doc.data().comment as string,
        },
      ],
      userList,
    );

    setUserList(users);
    if (res.docs[0]?.data().id) {
      setLastDate(res.docs[res.docs.length - 1].data().createdAt);
    }
    setLoading(false);
  };

  useEffect(() => {
    void getLast();
    void getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const playTitleArray: Array<PlayTitle> = [
    '遊戯王',
    'デュエマ',
    'ポケカ',
    'MTG',
    'ヴァンガード',
    'ヴァイス',
    'Z/X',
    'Lycee',
    'バディファイト',
    '遊戯王ラッシュ',
  ];

  let selectPlayTitle = playTitleArray;

  if (playTitle?.length) {
    const playTitleCheck = playTitleArray.filter(
      (i) => playTitle.indexOf(i) === -1,
    );
    selectPlayTitle = [...playTitle, ...playTitleCheck];
  }

  const onSubmit = (data: User) => {
    setLoading(true);
    setUserList([]);
    setOldestId('');
    setSearchValue(data);
    window.scrollTo(0, 0);
  };

  const onClickUser = (id?: string) => {
    setOpenId(id);
    onOpen();
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Container
            p={0}
            position="fixed"
            top="0"
            border="1px"
            borderColor="link"
            bg="primary"
            style={{ zIndex: 1 }}
          >
            <Accordion allowMultiple bg="primary">
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="center" color="link">
                      検索
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Wrap justify="center">
                      <WrapItem>
                        <Select
                          display="inline-block"
                          width="130px"
                          bg="secondary"
                          defaultValue={playTitle?.[0]}
                          placeholder="プレイタイトル"
                          {...register('playTitle')}
                        >
                          {selectPlayTitle.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </Select>
                      </WrapItem>
                      <WrapItem>
                        <Select
                          display="inline-block"
                          width="130px"
                          bg="secondary"
                          defaultValue={adress}
                          placeholder="都道府県"
                          {...register('adress')}
                        >
                          <SelectAdress />
                        </Select>
                      </WrapItem>
                      <WrapItem>
                        <Input
                          display="inline-block"
                          width="250px"
                          bg="secondary"
                          id="name"
                          placeholder="名前(前方一致)"
                          {...register('name')}
                        />
                      </WrapItem>
                      <WrapItem>
                        <Button
                          display="inline-block"
                          bg="link"
                          color="primary"
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
                          検索
                        </Button>
                      </WrapItem>
                    </Wrap>
                  </form>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Container>
          {oldestId ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={getUsers}
              hasMore={oldestId !== userList[userList.length - 1].id}
            >
              <SimpleGrid columns={2} spacing={3} marginY="50px">
                {userList.map((user) => (
                  <UserCard
                    key={user.id}
                    onClick={() => onClickUser(user.id)}
                    id={user.id}
                    name={user.name}
                    avatar={user.avatar}
                    playTitle={user.playTitle}
                    adress={user.adress}
                    favorite={user.favorite}
                    activityDay={user.activityDay}
                    activityTime={user.activityTime}
                    comment={user.comment}
                  />
                ))}
              </SimpleGrid>
            </InfiniteScroll>
          ) : (
            <Alert status="warning" marginTop="100px">
              <AlertIcon />
              該当するユーザはいませんでした
            </Alert>
          )}

          <Modal
            blockScrollOnMount={false}
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
          >
            <ModalOverlay />
            <ModalContent bg="secondary">
              <Icon
                as={ArrowBackIcon}
                boxSize="55px"
                color="link"
                onClick={onClose}
                cursor="pointer"
              />

              <ModalBody padding="0">
                <UserProfile userId={openId} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
});

export default Users;
