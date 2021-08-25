import firebase from 'firebase';

const useDateTime = (): ((
  timestamp: firebase.firestore.Timestamp,
) => string) => {
  const viewDateTime = (timestamp: firebase.firestore.Timestamp) => {
    const d = timestamp.toDate();
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1);
    const day = String(d.getDate());
    const hour = String(d.getHours());
    const min = String(d.getMinutes());
    const minZero = String(min).length === 1 ? '0' : '';
    const DateTime = `${year}/${month}/${day} ${hour}:${minZero}${min}`;

    return DateTime;
  };

  return viewDateTime;
};

export default useDateTime;
