import { Tag } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
};

const PrimaryTag: VFC<Props> = memo((props) => {
  const { children } = props;

  return (
    <Tag color="primary" bg="link">
      {children}
    </Tag>
  );
});
export default PrimaryTag;
