import PlayTitle from './playTitle';

type viewRecruit = {
  id?: string;
  organizerId?: string;
  title: string;
  playTitle: PlayTitle | 'その他';
  format?: string;
  recruitNumber: number;
  place: string;
  point: string;
  start: string;
  end: string;
  limit: string;
  overview?: string;
  friendOnly?: boolean;
  memberCount?: number;
  full?: boolean;
  cancel?: boolean;
  createdAt?: string;
};

export default viewRecruit;
