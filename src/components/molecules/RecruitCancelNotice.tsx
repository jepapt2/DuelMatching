import { Box, Text, Divider } from '@chakra-ui/react';
import { memo, useEffect, VFC } from 'react';

import { useHistory } from 'react-router';
import { db } from '../../firebase';

type Props = {
  id: string;
  recName: string;
  updateAt: string;
  roomId: string;
};

const RecrutCancelNotice: VFC<Props> = memo((props) => {
  const { id, recName, roomId, updateAt } = props;
  const history = useHistory();

  useEffect(() => {
    const unSub = async () => {
      await db
        .collection('users')
        .doc(id)
        .collection('notifications')
        .doc(`${roomId}_recruitCancel`)
        .update({
          read: true,
        });
    };

    void unSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        padding="5px"
        onClick={() => history.push(`/recruit/${roomId}`)}
        cursor="pointer"
      >
        <Text marginBottom="1" fontWeight="semibold">
          {recName}の募集はキャンセルされました
        </Text>

        <Text fontSize="sm">{updateAt}</Text>
      </Box>
      <Divider borderColor="secondary" />
    </>
  );
});
export default RecrutCancelNotice;
