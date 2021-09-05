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
  AccordionPanel,
  Container,
  Select,
  Button,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  Icon,
  AccordionIcon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { memo, useContext, useEffect, useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { RiFileEditFill } from 'react-icons/ri';
import InfiniteScroll from 'react-infinite-scroller';
import { useHistory } from 'react-router';
import { db } from '../../firebase';
import useDateTime from '../../hooks/useDateTime';
import PlayTitle from '../../types/playTitle';
import searchRecruit from '../../types/searchRecruit';
import viewRecruit from '../../types/viewRecruit';
import SelectAdress from '../atom/SelectAdress';
import RecruitCard from '../molecules/RecruitCard';
import Recruit from '../organisms/Recruit';
import UserProfile from '../organisms/UserProfile';
import { AuthContext } from '../providers/AuthContext';

const Recruits: VFC = memo(() => {
  const { id, name, avatar, adress, playTitle } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recruitsList, setRecruitsList] = useState<viewRecruit[]>([]);
  const [oldestId, setOldestId] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [openId, setOpenId] = useState<string | undefined>('');
  const [openUserId, setOpenUserId] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<searchRecruit>({});
  const viewDateTime = useDateTime();
  const history = useHistory();

  const { handleSubmit, register } = useForm<viewRecruit>({
    shouldUnregister: false,
  });

  const getLast = async () => {
    setLoading(true);

    let collection = db.collection('groups').where('full', '==', false);

    if (searchValue.playTitle) {
      collection = collection.where('playTitle', '==', searchValue.playTitle);
    }

    if (searchValue.place) {
      collection = collection.where('place', '==', searchValue.place);
    }

    if (searchValue.friendOnly) {
      collection = collection.where(
        'friendOnly',
        '==',
        !!Number(searchValue.friendOnly),
      );
    }

    collection = collection
      .orderBy('limit', 'desc')
      .where('limit', '>', new Date());

    const res = collection.limit(1).get();

    if ((await res).docs[0]?.id) {
      setOldestId((await res).docs[0].id);
    }
  };

  const getUsers = async () => {
    let collection = db.collection('groups').where('full', '==', false);

    if (searchValue.playTitle) {
      collection = collection.where('playTitle', '==', searchValue.playTitle);
    }

    if (searchValue.place) {
      collection = collection.where('place', '==', searchValue.place);
    }

    if (searchValue.friendOnly) {
      collection = collection.where(
        'friendOnly',
        '==',
        !!Number(searchValue.friendOnly),
      );
    }

    collection = collection
      .orderBy('limit', 'asc')
      .where('limit', '>', new Date());

    if (lastDate) {
      if (oldestId === recruitsList[recruitsList.length - 1]?.id) {
        return;
      }
      collection = collection.startAfter(lastDate);
    }

    const res = await collection.limit(5).get();

    const recruits = res.docs.reduce<viewRecruit[]>(
      (acc, doc) => [
        ...acc,
        {
          id: doc.id,
          title: doc.data().title as string,
          playTitle: doc.data().playTitle as PlayTitle,
          format: (doc.data().format as string) || '',
          recruitNumber: doc.data().recruitNumber as number,
          place: doc.data().place as string,
          point: doc.data().point as string,
          start: viewDateTime(doc.data().start),
          end: doc.data().end ? viewDateTime(doc.data().end) : '未定',
          limit: viewDateTime(doc.data().limit),
          friendOnly: doc.data().friendOnly as boolean,
          memberCount: doc.data().memberCount as number,
        },
      ],
      recruitsList,
    );

    setRecruitsList(recruits);
    if (res.docs[0]?.id) {
      setLastDate(res.docs[res.docs.length - 1].data().limit);
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

  const onSubmit = (data: searchRecruit) => {
    setLoading(true);
    setRecruitsList([]);
    setOldestId('');
    setLastDate('');
    setSearchValue(data);
    window.scrollTo(0, 0);
  };

  const onClickRecruit = (openid?: string) => {
    setOpenId(openid);
    onOpen();
  };

  const onCloseModal = () => {
    setOpenUserId('');
    onClose();
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
                <AccordionButton justifyContent="center">
                  <Text width="70px" color="link" display="inline-block">
                    検索
                  </Text>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Wrap justify="center">
                      <WrapItem>
                        <Select
                          display="inline-block"
                          width="140px"
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
                          width="120px"
                          bg="secondary"
                          defaultValue={adress}
                          placeholder="都道府県"
                          {...register('place')}
                        >
                          <SelectAdress />
                        </Select>
                      </WrapItem>
                      <WrapItem>
                        <Select
                          display="inline-block"
                          width="145px"
                          bg="secondary"
                          placeholder="募集範囲"
                          {...register('friendOnly')}
                        >
                          <option value={0}>誰でも</option>
                          <option value={1}>フレンドのみ</option>
                        </Select>
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
          <Container p={0} position="fixed" bottom="0">
            <VStack
              spacing={0}
              align="center"
              onClick={() => history.push('/recruitnew')}
              cursor="pointer"
              bg="link"
              borderRadius="full"
              padding="2px"
              position="absolute"
              width="50px"
              height="50px"
              bottom="60px"
              right="0"
            >
              <Icon
                as={RiFileEditFill}
                boxSize="30px"
                color="primary"
                display="inline-block"
              />
              <Text fontSize="10px" fontWeight="bold" color="primary">
                作成
              </Text>
            </VStack>
          </Container>

          <Box height="50px" />
          {recruitsList.length ? (
            <>
              <InfiniteScroll
                pageStart={0}
                loadMore={getUsers}
                hasMore={oldestId !== recruitsList[recruitsList.length - 1].id}
              >
                {recruitsList.map((recruit) => (
                  <RecruitCard
                    id={recruit.id}
                    key={recruit.id}
                    title={recruit.title}
                    onClick={() => onClickRecruit(recruit.id)}
                    friendOnly={recruit.friendOnly}
                    playTitle={recruit.playTitle}
                    format={recruit.format}
                    place={recruit.place}
                    point={recruit.point}
                    start={recruit.start}
                    end={recruit.end}
                    limit={recruit.limit}
                    recruitNumber={recruit.recruitNumber}
                    memberCount={recruit.memberCount}
                  />
                ))}
              </InfiniteScroll>
              <Box height="80px" />
            </>
          ) : (
            <Alert status="warning" marginTop="100px">
              <AlertIcon />
              該当する募集はありませんでした
            </Alert>
          )}

          <Modal
            blockScrollOnMount={false}
            isOpen={isOpen}
            onClose={onCloseModal}
            size="xl"
          >
            <ModalOverlay />
            {openUserId ? (
              <ModalContent bg="secondary">
                <Icon
                  as={ArrowBackIcon}
                  boxSize="55px"
                  color="link"
                  onClick={() => setOpenUserId('')}
                  cursor="pointer"
                />

                <ModalBody padding="0">
                  <UserProfile userId={openUserId} />
                </ModalBody>
              </ModalContent>
            ) : (
              <ModalContent bg="secondary">
                <Icon
                  as={ArrowBackIcon}
                  boxSize="55px"
                  color="link"
                  onClick={onClose}
                  cursor="pointer"
                />

                <ModalBody padding="0">
                  <Recruit
                    userId={id}
                    userName={name}
                    userAvatar={avatar}
                    recruitId={openId}
                    onClick={(clickId: string) => setOpenUserId(clickId)}
                  />
                </ModalBody>
              </ModalContent>
            )}
          </Modal>
        </>
      )}
    </>
  );
});

export default Recruits;
