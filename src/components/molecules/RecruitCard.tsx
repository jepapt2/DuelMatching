import { Box, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';

import { memo, VFC } from 'react';

import PlayTitle from '../../types/playTitle';
import PrimaryTag from '../atom/PrimaryTag';
import ProfileTbody from '../atom/ProfileTbody';

type Props = {
  onClick: (id?: string) => void;
  id?: string;
  title: string;
  friendOnly?: boolean;
  playTitle: PlayTitle | 'その他';
  format?: string;
  place: string;
  point: string;
  start: string;
  end: string;
  limit: string;
  recruitNumber: number;
  memberCount?: number;
};

const RecruitCard: VFC<Props> = memo((props) => {
  const {
    onClick,
    id,
    title,
    friendOnly,
    playTitle,
    format,
    place,
    point,
    start,
    end,
    limit,
    recruitNumber,
    memberCount,
  } = props;

  return (
    <Box
      bg="secondary"
      borderRadius="md"
      onClick={() => onClick(id)}
      padding="5px"
      marginBottom="20px"
      marginX="5px"
      cursor="pointer"
    >
      <Text fontWeight="bold" fontSize="lg" marginLeft="16px" marginY="10px">
        {title}
      </Text>
      <Table size="sm" variant="unstyled">
        <Tbody>
          <Tr>
            <Td>
              <PrimaryTag size="md">{playTitle}</PrimaryTag>
            </Td>
            <Td>{format}</Td>
          </Tr>
        </Tbody>
        <ProfileTbody
          field="募集範囲"
          value={friendOnly ? 'フレンドのみ' : '誰でも'}
        />
        <ProfileTbody field="開催場所" value={place} />
        <ProfileTbody field="詳細な場所" value={point} />
        <ProfileTbody
          field="募集人数"
          value={`${String(memberCount)}/${String(recruitNumber)}`}
        />
        <ProfileTbody field="時間" value={`${start} ~ ${end}`} />
        <ProfileTbody field="募集期限" value={limit} />
      </Table>
    </Box>
  );
});

export default RecruitCard;
