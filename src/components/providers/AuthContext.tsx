import React, { VFC, createContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user?.uid);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
