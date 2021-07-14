import React, { VFC, createContext, useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { auth } from '../../firebase';

type AuthContextProps = {
  currentUser: string | null | undefined;
};

type Props = {
  children: React.ReactNode;
};

export const AuthContext: React.Context<AuthContextProps> =
  createContext<AuthContextProps>({
    currentUser: undefined,
  });

export const AuthProvider: VFC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user?.uid);
      setLoading(false);
    });

    return unSub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {loading ? <Spinner /> : <>{children}</>}
    </AuthContext.Provider>
  );
};
