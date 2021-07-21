import PlayTitle from './playTitle';

type User = {
  name?: string;
  avatar?: string;
  header?: string;
  comment?: string;
  introduction?: string;
  favorite?: string;
  playTitle?: Array<PlayTitle>;
  adress?: string;
  activityDay?: string;
  activityTime?: string;
  sex?: string;
  age?: string;
};

export default User;
