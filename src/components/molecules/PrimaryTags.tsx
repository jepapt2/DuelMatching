import { Wrap, WrapItem } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import PlayTitle from '../../types/playTitle';
import PrimaryTag from '../atom/PrimaryTag';

type Props = {
  playTitle?: Array<PlayTitle>;
  size: 'sm' | 'md' | 'lg';
};

const PrimaryTags: VFC<Props> = memo(({ playTitle, size }) => (
  <>
    <Wrap>
      {playTitle?.map((tag) => (
        <WrapItem key={tag}>
          <PrimaryTag size={size}>{tag}</PrimaryTag>
        </WrapItem>
      ))}
    </Wrap>
  </>
));
export default PrimaryTags;
