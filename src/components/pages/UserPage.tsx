import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, Icon, Spacer } from '@chakra-ui/react';
import { memo, useContext, VFC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import FriendButton from '../molecules/FriendButton';
import UserProfile from '../organisms/UserProfile';
import { AuthContext } from '../providers/AuthContext';

const UserPage: VFC = memo(() => {
  const { id: recId } = useParams<{ id: string }>();
  const { id, name, avatar } = useContext(AuthContext);
  const history = useHistory();

  return (
    <>
      <Flex>
        <Icon
          as={ArrowBackIcon}
          boxSize="55px"
          color="link"
          onClick={() => history.goBack()}
          cursor="pointer"
          display="inline-block"
        />
        <Spacer />
        <FriendButton
          sendId={id}
          sendName={name}
          sendAvatar={avatar}
          recId={recId}
        />
      </Flex>
      <UserProfile userId={recId} />
    </>
  );
});

export default UserPage;
