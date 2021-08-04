import { Tag } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
  size: 'sm' | 'md' | 'lg';
};

const PrimaryTag: VFC<Props> = memo(({ children, size }) => (
  <Tag color="primary" bg="link" size={size}>
    {children}
  </Tag>
));
export default PrimaryTag;
