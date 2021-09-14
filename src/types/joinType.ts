import firebase from 'firebase';

type JoinType = {
  id: string;
  title?: string;
  start: firebase.firestore.Timestamp;
  limit: firebase.firestore.Timestamp;
  cancel?: boolean;
};

export default JoinType;
