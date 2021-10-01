import { memo, useEffect, useState, VFC } from 'react';
import {
  Avatar,
  Box,
  Center,
  Img,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { db } from '../../firebase';

import User from '../../types/user';
import PlayTitle from '../../types/playTitle';
import ProfileTable from '../molecules/ProfileTable';

type Props = {
  userId?: string;
};

const UserProfile: VFC<Props> = memo(({ userId }) => {
  const [value, setValue] = useState<User>({
    name: '',
    avatar: '',
    header: '',
    comment: '',
    introduction: '',
    favorite: '',
    playTitle: [''],
    adress: '',
    activityDay: '',
    activityTime: '',
    sex: '',
    age: '',
  });

  useEffect(() => {
    const unSub = db
      .collection('users')
      .doc(userId)
      .onSnapshot((doc) => {
        const data = doc.data() as Omit<User, 'playTitle'>;
        let playTitle: string | Array<PlayTitle> = '';
        if (Array.isArray(doc.data()?.playTitle)) {
          playTitle = doc.data()?.playTitle as Array<PlayTitle>;
        } else if (!doc.exists) {
          playTitle = [''];
        } else {
          const stringPlayTitle = doc.data()?.playTitle as string;
          playTitle = stringPlayTitle.split(',') as Array<PlayTitle>;
        }
        setValue({
          name: data?.name,
          avatar: data?.avatar,
          header: data?.header,
          comment: data?.comment,
          introduction: data?.introduction,
          favorite: data?.favorite,
          playTitle,
          adress: data?.adress,
          activityDay: data?.activityDay,
          activityTime: data?.activityTime,
          sex: data?.sex,
          age: data?.age,
        });
      });

    return () => {
      unSub();
    };
  }, [userId]);

  return (
    <>
      {value.header && (
        <Center>
          <Img src={value.header} marginY="10px" />
        </Center>
      )}

      <Box bg="secondary" paddingTop="8px" paddingBottom="20px" height="100%">
        <Box
          bg="primary"
          borderRadius="xl"
          marginX="5px"
          padding="5px"
          marginBottom="20px"
        >
          <Table size="sm" variant="unstyled">
            <Thead>
              <Tr>
                <Th width="35px" paddingX="10px" paddingY="0">
                  <Avatar src={value.avatar} />
                </Th>
                <Th fontSize="lg" textTransform="none">
                  {value.name || 'unknown'}
                </Th>
              </Tr>
            </Thead>
            {value.comment ? (
              <Tbody>
                <Tr>
                  <Td />
                  <Td>{value.comment}</Td>
                </Tr>
              </Tbody>
            ) : (
              <></>
            )}
          </Table>
        </Box>
        <ProfileTable
          playTitle={value.playTitle}
          adress={value.adress}
          activityDay={value.activityDay}
          activityTime={value.activityTime}
          favorite={value.favorite}
          age={value.age}
          sex={value.sex}
        />
        {value.introduction && (
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
            <Text>{value.introduction}</Text>
          </Box>
        )}
        <Box height="100px" />
      </Box>
    </>
  );
});

export default UserProfile;
