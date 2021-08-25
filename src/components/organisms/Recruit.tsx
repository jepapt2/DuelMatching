import { memo, useEffect, useState, VFC } from 'react';
import {
  Avatar,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { db } from '../../firebase';
import Recruit from '../../types/Recruit';
import PrimaryTag from '../atom/PrimaryTag';
import ProfileTbody from '../atom/ProfileTbody';
import viewRecruit from '../../types/viewRecruit';
import useDateTime from '../../hooks/useDateTime';
import Member from '../../types/member';

type Props = {
  recruitId?: string;
  onClick: (id: string) => void;
};

const RecruitProfile: VFC<Props> = memo(({ recruitId, onClick }) => {
  const [recruit, setRecruit] = useState<viewRecruit>({
    title: '',
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
  });
  const [members, setMembers] = useState<Member[]>([
    {
      id: '',
      name: '',
      avatar: '',
    },
  ]);

  const viewDateTime = useDateTime();

  useEffect(() => {
    const unSubRecruit = db
      .collection('groups')
      .doc(recruitId)
      .onSnapshot((doc) => {
        const data = doc.data() as Recruit;
        setRecruit({
          id: doc.id,
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
          createdAt: data?.createdAt,
        });
      });

    return () => {
      unSubRecruit();
    };
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
                    <Avatar src={m.avatar} />
                  </WrapItem>
                ))}
              </Wrap>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box height="100px" />
      </Box>
    </>
  );
});

export default RecruitProfile;
