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
          result.user?.metadata.creationTime ===
          result.user?.metadata.lastSignInTime
        ) {
          history.push('/login');
        } else {
          history.push('/login');
        }
      });
  };

  return login;
};

export const logout = (): Promise<void> =>
  new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => resolve())
      .catch((error) => reject(error));
  });
