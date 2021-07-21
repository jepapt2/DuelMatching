import firebase from 'firebase';
import { useHistory } from 'react-router';
import { auth } from '../firebase';

export const useLogin: () => (
  provider: firebase.auth.AuthProvider,
) => Promise<void> = () => {
  const history = useHistory();
  const login = async (provider: firebase.auth.AuthProvider): Promise<void> => {
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        if (
          // 新規登録か判定
          result.user?.metadata.creationTime ===
          result.user?.metadata.lastSignInTime
        ) {
          history.push('/profile/edit');
        } else {
          history.push('/login');
        }
      });
  };

  return login;
};

export const useLogout = (): (() => void) => {
  const logout = () => {
    void auth.signOut();
  };

  return logout;
};
