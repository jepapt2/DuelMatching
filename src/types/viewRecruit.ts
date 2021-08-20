import Recruit from './Recruit';

type vieweRecruit = Omit<Recruit, 'start' | 'end' | 'limit'> & {
  start?: string;
  end?: string;
  limit?: string;
};

export default vieweRecruit;
