/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useContext, memo, VFC, useState } from 'react';
import { db } from '../../firebase';
import User from '../../types/user';
import ProfileTabs from '../molecules/ProfileTabs';
import { AuthContext } from '../providers/AuthContext';
import EditHeader from '../organisms/EditHeader';
import EditAvatar from '../organisms/EditAvatar';

const Edit: VFC = memo(() => {
  const userId = useContext(AuthContext).currentUser as string;
  const [value, setValue] = useState<User>({
    name: '',
    avatar: '',
    header: '',
  });

  useEffect(() => {
    const unSub = () => {
      db.collection('users')
        .doc(userId)
        .onSnapshot((doc) => {
          const data = doc.data() as User;
          setValue({
            name: data.name,
            avatar: data.avatar,
            header: data.header,
          });
        });
    };

    void unSub();
  }, [userId]);

  return (
    <>
      <ProfileTabs index={0} />
      <EditHeader valueHeader={value.header} userId={userId} />
      <EditAvatar valueAvatar={value.avatar} userId={userId} />
    </>
  );
});

export default Edit;
