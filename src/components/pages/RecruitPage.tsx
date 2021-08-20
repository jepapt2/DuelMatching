import { memo, VFC } from 'react';
import { useParams } from 'react-router-dom';
import Recruit from '../organisms/Recruit';

const Profile: VFC = memo(() => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Recruit recruitId={id} />
    </>
  );
});

export default Profile;
