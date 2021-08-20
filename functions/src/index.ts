import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onCreateUser = functions.auth
  .user()
  .onCreate(async (userRecord) => {
    const userCount = db.collection('counts').doc('users');
    const getUserCount = await userCount.get();
    userCount.update({ create: admin.firestore.FieldValue.increment(1) });

    db.collection('users')
      .doc(userRecord.uid)
      .set({
        name: userRecord.displayName,
        avatar: userRecord.photoURL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        introduction: '',
        activityDay: '',
        activityTime: '',
        adress: '',
        age: '',
        comment: '',
        favorite: '',
        header: '',
        sex: '',
        playTitle: [],
        order: getUserCount.data()?.create + 1,
      });
  });

export const onCreateRecruit = functions.firestore
  .document('/groups/{userId}')
  .onCreate(async (userRecord) => {
    const recruitCount = db.collection('counts').doc('groups');
    const getRecruitCount = await recruitCount.get();
    recruitCount.update({ create: admin.firestore.FieldValue.increment(1) });

    db.collection('groups')
      .doc(userRecord.id)
      .update({
        order: getRecruitCount.data()?.create + 1,
      });
  });
