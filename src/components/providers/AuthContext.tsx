/* eslint-disable @typescript-eslint/await-thenable */
import React, { VFC, memo, createContext, useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { auth, db } from '../../firebase';
import PlayTitle from '../../types/playTitle';

type AuthContextProps = {
  id?: string | undefined;
  name?: string | undefined;
  avatar?: string | undefined;
  playTitle?: PlayTitle[];
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext: React.Context<AuthContextProps> =
  createContext<AuthContextProps>({
    id: '',
    name: '',
    avatar: '',
    playTitle: [''],
  });

export const AuthProvider: VFC<Props> = memo(({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthContextProps>({
    id: '',
    name: '',
    avatar: '',
    playTitle: [''],
  });
  // const [users, setUsers] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unSub = () => {
      auth.onAuthStateChanged((user) => {
        db.collection('users')
          .doc(user?.uid)
          .onSnapshot((doc) => {
            const data = doc.data() as AuthContextProps;
            let playTitle: string | Array<PlayTitle> = '';
            if (Array.isArray(doc.data()?.playTitle)) {
              playTitle = doc.data()?.playTitle as Array<PlayTitle>;
            } else {
              const stringPlayTitle = doc.data()?.playTitle as string;
              playTitle = stringPlayTitle.split(',') as Array<PlayTitle>;
            }
            setCurrentUser({
              id: user?.uid,
              name: data?.name,
              avatar: data?.avatar,
              playTitle,
            });
            setLoading(false);
          });
      });
    };
    unSub();
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {loading ? <Spinner /> : <>{children}</>}
    </AuthContext.Provider>
  );
});
