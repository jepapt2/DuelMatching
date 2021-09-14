import { memo, useEffect, useState, VFC } from 'react';
import {
  Avatar,
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import firebase from 'firebase';
import { db } from '../../firebase';
import Recruit from '../../types/Recruit';
import PrimaryTag from '../atom/PrimaryTag';
import ProfileTbody from '../atom/ProfileTbody';
import viewRecruit from '../../types/viewRecruit';
import useDateTime from '../../hooks/useDateTime';
import Member from '../../types/member';

type Props = {
  userId?: string;
  userName?: string;
  userAvatar?: string;
  recruitId?: string;
  onClick: (id: string) => void;
};

const RecruitProfile: VFC<Props> = memo(
  ({ userId, userName, userAvatar, recruitId, onClick }) => {
    const [recruit, setRecruit] = useState<viewRecruit>({
      title: '',
      organizerId: '',
      playTitle: '',
      format: '',
      recruitNumber: 0,
      place: '',
      point: '',
      start: '',
      end: '',
      limit: '',
      overview: '',
      friendOnly: false,
      createdAt: '',
      cancel: false,
    });
    const [limit, setLimit] = useState<number>(0);
    const [friend, setFriend] = useState<boolean>(false);
    const [members, setMembers] = useState<Member[]>([
      {
        id: '',
        name: '',
        avatar: '',
      },
    ]);
    const toast = useToast();
    const viewDateTime = useDateTime();

    const unSubRecruit = () => {
      db.collection('groups')
        .doc(recruitId)
        .onSnapshot((doc) => {
          const data = doc.data() as Recruit;
          setRecruit({
            id: doc.id,
            organizerId: data?.organizerId,
            title: data.title,
            playTitle: data?.playTitle,
            format: data?.format,
            recruitNumber: data?.recruitNumber,
            place: data?.place,
            point: data?.point,
            start: viewDateTime(data?.start),
            end: data.end ? viewDateTime(data?.end) : '未定',
            limit: viewDateTime(data?.limit),
            overview: data?.overview,
            friendOnly: data?.friendOnly,
            memberCount: data?.memberCount,
            full: data?.full,
            cancel: data?.cancel,
            createdAt: data?.createdAt,
          });
          setLimit(data?.limit.toDate().getTime());

          if (data.friendOnly) {
            void db
              .collection('users')
              .doc('id')
              .collection('friends')
              .doc(data.organizerId)
              .get()
              .then((friendDoc) => {
                setFriend(!friendDoc.exists);
              });
          }
        });
    };

    useEffect(() => {
      void unSubRecruit();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recruitId]);

    useEffect(() => {
      const unSubMember = db
        .collection('groups')
        .doc(recruitId)
        .collection('members')
        .orderBy('organizer', 'desc')
        .onSnapshot((snapshot) => {
          setMembers(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name as string,
              avatar: doc.data().avatar as string,
            })),
          );
        });

      return () => {
        unSubMember();
      };
    }, [recruitId]);

    const submitMember = async () => {
      if (recruit.cancel) {
        toast({
          title: '募集はキャンセルされました',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      } else if (limit < new Date().getTime()) {
        toast({
          title: '期限を過ぎました',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      } else if (members.map((obj) => obj.id).includes(userId as string)) {
        toast({
          title: '登録済みです',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      } else if (recruit.full) {
        toast({
          title: '満員です',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      } else if (friend) {
        toast({
          title: 'フレンドしか参加できません',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      } else {
        await db
          .collection('groups')
          .doc(recruit.id)
          .collection('members')
          .doc(userId)
          .set({
            uid: userId,
            name: userName,
            avatar: userAvatar,
            organizer: false,
            createdAt: new Date(),
          });
        await db
          .collection('groups')
          .doc(recruit.id)
          .update({
            memberCount: firebase.firestore.FieldValue.increment(1),
            full: (recruit.memberCount as number) + 1 === recruit.recruitNumber,
          });
      }
    };

    const deleteMember = async () => {
      await db
        .collection('groups')
        .doc(recruit.id)
        .collection('members')
        .doc(userId)
        .delete();
      await db
        .collection('groups')
        .doc(recruit.id)
        .update({
          memberCount: firebase.firestore.FieldValue.increment(-1),
          full: (recruit.memberCount as number) - 1 > recruit.recruitNumber,
        });
    };

    const recruitCansel = async () => {
      await db.collection('groups').doc(recruit.id).update({
        cancel: true,
      });
    };

    const submitButton = () => {
      if (recruit.cancel) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="primary"
            color="red.500"
            isDisabled
            marginBottom="100px"
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
            この募集はキャンセルされました
          </Button>
        );
      }
      if (userId === recruit.organizerId) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="link"
            color="primary"
            onClick={recruitCansel}
            marginBottom="100px"
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
            募集をキャンセルする
          </Button>
        );
      }
      if (members.map((obj) => obj.id).includes(userId as string)) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="link"
            color="primary"
            onClick={deleteMember}
            marginBottom="100px"
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
            募集を抜ける
          </Button>
        );
      }
      if (limit < new Date().getTime()) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="link"
            color="primary"
            isDisabled
            marginBottom="100px"
          >
            期限を過ぎました
          </Button>
        );
      }
      if (recruit.full) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="link"
            color="primary"
            isDisabled
            marginBottom="100px"
          >
            満員です
          </Button>
        );
      }
      if (friend) {
        return (
          <Button
            marginTop="30px"
            width="100%"
            bg="link"
            color="primary"
            isDisabled
            marginBottom="100px"
          >
            フレンドのみ参加できます
          </Button>
        );
      }

      return (
        <Button
          marginTop="30px"
          width="100%"
          bg="link"
          color="primary"
          onClick={submitMember}
          marginBottom="100px"
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
          募集に参加する
        </Button>
      );
    };

    return (
      <>
        <Box bg="secondary" paddingTop="8px" paddingBottom="20px" height="100%">
          <Box
            bg="primary"
            borderRadius="xl"
            marginX="5px"
            paddingY="8px"
            paddingX="15px"
            marginBottom="20px"
          >
            <Text fontSize="lg" fontWeight="bold">
              {recruit.title || ''}
            </Text>
          </Box>
          <Box
            bg="primary"
            borderRadius="xl"
            marginX="5px"
            padding="5px"
            marginBottom="20px"
          >
            <Table size="sm" variant="unstyled">
              <Tbody>
                <Tr>
                  <Td>プレイタイトル</Td>
                  <Td>
                    <PrimaryTag size="md">{recruit.playTitle}</PrimaryTag>
                  </Td>
                </Tr>
              </Tbody>
              <ProfileTbody field="対戦形式" value={recruit.format} />
              <ProfileTbody
                field="募集範囲"
                value={recruit.friendOnly ? 'フレンドのみ' : '誰でも'}
              />
              <ProfileTbody field="開催場所" value={recruit.place} />
              <ProfileTbody field="詳細な場所" value={recruit.point} />
              <ProfileTbody
                field="募集人数"
                value={`${String(recruit.memberCount)}/${String(
                  recruit.recruitNumber,
                )}`}
              />
              <ProfileTbody
                field="時間"
                value={`${recruit.start} ~ ${recruit.end}`}
              />
              <ProfileTbody field="募集期限" value={recruit.limit} />
            </Table>
          </Box>
          {recruit.overview && (
            <Box
              bg="primary"
              borderRadius="xl"
              marginX="5px"
              padding="10px"
              marginBottom="20px"
            >
              <Text fontSize="sm" marginBottom="8px">
                概要
              </Text>
              <Text>{recruit.overview}</Text>
            </Box>
          )}
          <Box
            bg="primary"
            borderRadius="xl"
            marginX="5px"
            padding="10px"
            marginBottom="20px"
          >
            <Text fontSize="sm" marginBottom="8px">
              主催者
            </Text>
            <Box cursor="pointer" onClick={() => onClick(members[0].id)}>
              <Avatar
                src={members[0].avatar}
                display="inline-block"
                marginRight="5px"
              />
              <Text display="inline-block" marginTop="12px">
                {members[0].name}
              </Text>
            </Box>
            {members.length >= 2 ? (
              <>
                <Text fontSize="sm" marginBottom="8px" marginTop="5px">
                  メンバー
                </Text>
                <Wrap>
                  {members.slice(1).map((m) => (
                    <WrapItem key={m.id}>
                      <Avatar
                        src={m.avatar}
                        cursor="pointer"
                        onClick={() => onClick(m.id)}
                      />
                    </WrapItem>
                  ))}
                </Wrap>
              </>
            ) : (
              <></>
            )}
          </Box>
          {submitButton()}
          <Box height="100px" />
        </Box>
      </>
    );
  },
);

export default RecruitProfile;
