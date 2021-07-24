import { Box, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import PlayTitle from '../../types/playTitle';
import ProfileTbody from '../atom/ProfileTbody';
import PrimaryTags from './PrimaryTags';

type Props = {
  playTitle?: Array<PlayTitle>;
  adress?: string;
  activityDay?: string;
  activityTime?: string;
  favorite?: string;
  age?: string;
  sex?: string;
};

const ProfileTable: VFC<Props> = memo((props) => {
  const { playTitle, ...stringProfile } = props;
  const { adress, activityDay, activityTime, favorite, age, sex } =
    stringProfile;

  return (
    <>
      {!playTitle?.[0] &&
      !Object.values(stringProfile).filter(Boolean).length ? (
        <></>
      ) : (
        <Box
          bg="primary"
          borderRadius="xl"
          marginX="5px"
          padding="5px"
          marginBottom="20px"
        >
          <Table size="sm" variant="unstyled">
            {!!playTitle?.length && (
              <Tbody>
                <Tr>
                  <Td>プレイタイトル</Td>
                  <Td>
                    <PrimaryTags playTitle={playTitle} />
                  </Td>
                </Tr>
              </Tbody>
            )}
            <ProfileTbody field="居住地" value={adress} />
            <ProfileTbody field="活動日" value={activityDay} />
            <ProfileTbody field="活動時間" value={activityTime} />
            <ProfileTbody field="好きなカード" value={favorite} />
            <ProfileTbody field="年齢" value={age} />
            <ProfileTbody field="性別" value={sex} />
          </Table>
        </Box>
      )}
    </>
  );
});
export default ProfileTable;
