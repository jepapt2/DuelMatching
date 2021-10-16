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
          updateAt: new Date(),
        }),
    );
  });

export const onCreateGroupChat = functions.firestore
  .document('/groups/{groupId}/chat/{messageId}')
  .onCreate(async (userRecord, context) => {
    const groupTitle = await db
      .collection('groups')
      .doc(context.params.groupId)
      .get()
      .then((doc) => doc.data()?.title as string);

    const getUser = await db
      .collection('groups')
      .doc(context.params.groupId)
      .collection('members')
      .get();
    const userId = getUser.docs.map((doc) => doc.id);

    userId.map((id: string) =>
      db
        .collection('users')
        .doc(id)
        .collection('notifications')
        .doc(`${context.params.groupId}_newGroupMessage`)
        .set({
          type: 'newGroupMessage',
          roomId: context.params.groupId,
          recName: `${groupTitle} (${userId.length})`,
          text: userRecord.data().text,
          read: id === userRecord.data().userId,
          updateAt: new Date(),
        }),
    );
  });

export const onCancelRecruit = functions.firestore
  .document('/groups/{groupId}')
  .onUpdate(async (change, context) => {
    if (change.after.data().cancel) {
      const getUser = await db
        .collection('groups')
        .doc(context.params.groupId)
        .collection('members')
        .get();
      const userId = getUser.docs.map((doc) => doc.id);

      userId.map((id: string) =>
        db
          .collection('users')
          .doc(id)
          .collection('notifications')
          .doc(`${context.params.groupId}_recruitCancel`)
          .set({
            type: 'recruitCancel',
            roomId: context.params.groupId,
            recName: change.after.data().title,
            read: id === change.after.data().organizerId,
            updateAt: new Date(),
          }),
      );
    }
  });

export const onFriendCreate = functions.firestore
  .document('/requests/{requestId}')
  .onUpdate(async (change, context) => {
    const recProfile = await db
      .collection('users')
      .doc(change.after.data().recId)
      .get()
      .then((doc) => ({
        id: doc.id,
        name: doc.data()?.name,
        avatar: doc.data()?.avatar,
      }));

    const sendProfile = await db
      .collection('users')
      .doc(change.after.data().sendId)
      .get()
      .then((doc) => ({
        id: doc.id,
        name: doc.data()?.name,
        avatar: doc.data()?.avatar,
      }));
    if (change.after.data().permission) {
      db.collection('users')
        .doc(recProfile.id)
        .collection('friends')
        .doc(sendProfile.id)
        .set({
          name: sendProfile.name,
          avatar: sendProfile.avatar,
          uid: sendProfile.id,
          createdAt: new Date(),
        });
      db.collection('users')
        .doc(sendProfile.id)
        .collection('friends')
        .doc(recProfile.id)
        .set({
          name: recProfile.name,
          avatar: recProfile.avatar,
          uid: recProfile.id,
          createdAt: new Date(),
        });

      db.collection('requests').doc(context.params.requestId).delete();
      db.collection('users')
        .doc(recProfile.id)
        .collection('notifications')
        .doc(`${sendProfile.id}_friendReq`)
        .delete();
    }

    if (change.after.data().rejection) {
      db.collection('requests').doc(context.params.requestId).delete();
      db.collection('users')
        .doc(recProfile.id)
        .collection('notifications')
        .doc(`${sendProfile.id}_friendReq`)
        .delete();
    }
  });

export const onJoinMember = functions.firestore
  .document('/groups/{groupId}/members/{memberId}')
  .onCreate(async (snap, context) => {
    await db
      .collection('groups')
      .doc(context.params.groupId)
      .collection('chat')
      .add({
        userId: snap.id,
        text: `${snap.data().name}が参加しました`,
        createdAt: new Date(),
      });
  });

export const onDeleteMember = functions.firestore
  .document('/groups/{groupId}/members/{memberId}')
  .onDelete(async (snap, context) => {
    await db
      .collection('groups')
      .doc(context.params.groupId)
      .collection('chat')
      .add({
        userId: snap.id,
        text: `${snap.data().name}が抜けました`,
        createdAt: new Date(),
      });
  });

export const onChangeUserName = functions.firestore
  .document('/users/{userId}')
  .onUpdate(async (change, context) => {
    if (change.before.data().name !== change.after.data().name) {
      const batch = db.batch();

      const membersDocref = db
        .collectionGroup('members')
        .where('uid', '==', context.params.userId);

      (await membersDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { name: change.after.data().name }),
      );

      const partnersDocref = db
        .collectionGroup('partners')
        .where('uid', '==', context.params.userId);

      (await partnersDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { name: change.after.data().name }),
      );

      const friendsDocref = db
        .collectionGroup('friends')
        .where('uid', '==', context.params.userId);

      (await friendsDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { name: change.after.data().name }),
      );

      await batch.commit();
    }
  });

export const onChangeUserAvatar = functions.firestore
  .document('/users/{userId}')
  .onUpdate(async (change, context) => {
    if (change.before.data().avatar !== change.after.data().avatar) {
      const batch = db.batch();

      const membersDocref = db
        .collectionGroup('members')
        .where('uid', '==', context.params.userId);

      (await membersDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { avatar: change.after.data().avatar }),
      );

      const partnersDocref = db
        .collectionGroup('partners')
        .where('uid', '==', context.params.userId);

      (await partnersDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { avatar: change.after.data().avatar }),
      );

      const friendsDocref = db
        .collectionGroup('friends')
        .where('uid', '==', context.params.userId);

      (await friendsDocref.get()).docs.map((doc) =>
        batch.update(doc.ref, { avatar: change.after.data().avatar }),
      );

      await batch.commit();
    }
  });

export const onDeleteFriend = functions.firestore
  .document('/users/{userId}/friends/{friendId}')
  .onDelete(async (snap, context) => {
    await db
      .collection('users')
      .doc(context.params.friendId)
      .collection('friends')
      .doc(context.params.userId)
      .delete();
  });
