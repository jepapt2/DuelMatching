import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, Icon, Spacer } from '@chakra-ui/react';
import { memo, useContext, VFC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Recruit from '../organisms/Recruit';
import { AuthContext } from '../providers/AuthContext';

const Profile: VFC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { id: userId, name, avatar } = useContext(AuthContext);
  const history = useHistory();

  return (
    <>
      <Flex>
        <Icon
          as={ArrowBackIcon}
          boxSize="50px"
          color="link"
          onClick={() => history.goBack()}
          cursor="pointer"
          display="inline-block"
        />
        <Spacer />
      </Flex>
      <Recruit
        userId={userId}
        userName={name}
        userAvatar={avatar}
        recruitId={id}
        onClick={() => history.push(`/recruit/${id}`)}
      />
    </>
  );
});

export default Profile;
