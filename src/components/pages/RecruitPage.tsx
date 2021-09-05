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
