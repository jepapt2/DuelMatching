import { memo, VFC } from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../organisms/UserProfile';

const UserPage: VFC = memo(() => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <UserProfile userId={id} />
    </>
  );
});

export default UserPage;
