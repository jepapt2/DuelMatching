import { memo, VFC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Recruit from '../organisms/Recruit';

const Profile: VFC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  return (
    <>
      <Recruit recruitId={id} onClick={() => history.push(`/recruit/${id}`)} />
    </>
  );
});

export default Profile;
