type Notification = {
  id: string;
  type: string;
  recId: string;
  recName: string;
  recAvatar: string;
  read: boolean;
  updateAt: string;
  text?: string;
};

export default Notification;
