import PlayTitle from './playTitle';

type Recruit = {
  title?: string;
  playTitle?: PlayTitle | 'その他';
  place?: string;
  friendOnly?: string;
};

export default Recruit;
