/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { memo, useEffect, useState, VFC } from 'react';
import { Box, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';

import { db } from '../../firebase';
import Recruit from '../../types/Recruit';
import PrimaryTag from '../atom/PrimaryTag';
import ProfileTbody from '../atom/ProfileTbody';
import viewRecruit from '../../types/viewRecruit';

type Props = {
  recruitId?: string;
};

// type Member = {
//   id: string;
//   name: string;
//   avatar: string;
// };

const UserProfile: VFC<Props> = memo(({ recruitId }) => {
  const [recruit, setRecruit] = useState<viewRecruit>({
    title: '',
    playTitle: '',
    format: '',
    recruitNumber: 0,
    place: '',
    point: '',
    start: undefined,
    end: undefined,
    limit: undefined,
    overview: '',
    friendOnly: false,
    createdAt: '',
  });
  // const [members, setMembers] = useState<Member[]>([
  //   {
  //     id: '',
  //     name: '',
  //     avatar: '',
  //   },
  // ]);

  useEffect(() => {
    const unSub = db
      .collection('groups')
      .doc(recruitId)
      .onSnapshot((doc) => {
        const data = doc.data() as Recruit;
        const a = data?.start?.toDate();
        const b = a?.getDate();
        setRecruit({
          id: doc.id,
          title: data?.title,
          playTitle: data?.playTitle,
          format: data?.format,
          recruitNumber: data?.recruitNumber,
          place: data?.place,
          point: data?.point,
          start: String(b),
          // end: data?.end.toDate(),
          // limit: data?.limit.toDate(),
          overview: data?.overview,
          friendOnly: data?.friendOnly,
          memberCount: data?.memberCount,
          createdAt: data?.createdAt,
        });
      });

    return () => {
      unSub();
    };
  }, [recruitId]);

  return (
    <>
      <Box bg="secondary" paddingTop="8px" paddingBottom="20px" height="100%">
        <Box
          bg="primary"
          borderRadius="xl"
          marginX="5px"
          padding="5px"
          marginBottom="20px"
        >
          <Text fontSize="lg">{recruit.title || ''}</Text>
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
                  <PrimaryTag size="lg">{recruit.playTitle}</PrimaryTag>
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
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              value={`${recruit.start} ~ ${recruit.end && '未定'}`}
            />
          </Table>
        </Box>
        {recruit.overview && (
          <Box
            bg="primary"
            borderRadius="xl"
            marginX="5px"
            padding="5px"
            marginBottom="70px"
          >
            <Text fontSize="sm" marginBottom="8px">
              自己紹介
            </Text>
            <Text>{recruit.overview}</Text>
          </Box>
        )}
        <Box height="100px" />
      </Box>
    </>
  );
});

export default UserProfile;
