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
  .document('/groups/{groupId}')
  .onCreate(async (groupRecord) => {
    const recruitCount = db.collection('counts').doc('groups');
    const getRecruitCount = await recruitCount.get();
    recruitCount.update({ create: admin.firestore.FieldValue.increment(1) });

    db.collection('groups')
      .doc(groupRecord.id)
      .update({
        order: getRecruitCount.data()?.create + 1,
      });
  });

export const onCreateRequest = functions.firestore
  .document('/requests/{requestId}')
  .onCreate(async (requestRecord) => {
    db.collection('users')
      .doc(requestRecord.data().recId)
      .collection('notifications')
      .doc(`${requestRecord.data().sendId}_friendReq`)
      .set({
        type: 'friendRequest',
        recId: requestRecord.data().sendId,
        recName: requestRecord.data().sendName,
        recAvatar: requestRecord.data().sendAvatar,
        read: false,
        updateAt: new Date(),
      });
  });

export const onUpdateRequest = functions.firestore
  .document('/requests/{requestId}')
  .onUpdate(async (requestRecord) => {
    db.collection('users')
      .doc(requestRecord.after.data().recId)
      .collection('notifications')
      .doc(`${requestRecord.after.data().sendId}_friendReq`)
      .set({
        type: 'friendRequest',
        recId: requestRecord.after.data().sendId,
        recName: requestRecord.after.data().sendName,
        recAvatar: requestRecord.after.data().sendAvatar,
        read: false,
        updateAt: new Date(),
      });
  });

export const onCreateFriend = functions.firestore
  .document('/users/{userId}/friends/{friendId}')
  .onCreate(async (userRecord, context) => {
    db.collection('users')
      .doc(context.params.userId)
      .collection('notifications')
      .doc(`${userRecord.id}_newFriend`)
      .set({
        type: 'newFriend',
        recId: userRecord.id,
        recName: userRecord.data().name,
        recAvatar: userRecord.data().avatar,
        read: false,
        updateAt: new Date(),
      });
  });

export const onCreateChat = functions.firestore
  .document('/chatRooms/{roomId}/chat/{messageId}')
  .onCreate(async (userRecord, context) => {
    const userList = context.params.roomId.split('_');

    const userProfile = await Promise.all(
      userList.map(async (userId: string, index: number) => {
        const getUser = await db.collection('users').doc(userId).get();
        const getProfile = {
          id: userList[index === 0 ? 1 : 0],
          name: getUser.data()?.name,
          avatar: getUser.data()?.avatar,
        };

        return getProfile;
      }),
    );

    userProfile.map((user: any) =>
      db
        .collection('users')
        .doc(user.id)
        .collection('notifications')
        .doc(`${context.params.roomId}_newMessage`)
        .set({
          type: 'newMessage',
          roomId: context.params.roomId,
          recId: user.id,
          recName: user.name,
          recAvatar: user.avatar,
          text: userRecord.data().text,
          read: user.id === userRecord.data().userId,
          updateAt: userRecord.data().createdAt,
        }),
    );
  });
