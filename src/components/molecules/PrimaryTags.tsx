import { Wrap, WrapItem } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import PlayTitle from '../../types/playTitle';
import PrimaryTag from '../atom/PrimaryTag';

type Props = {
  playTitle?: Array<PlayTitle>;
};

const PrimaryTags: VFC<Props> = memo(({ playTitle }) => (
  <>
    <Wrap>
      {playTitle?.map((tag) => (
        <WrapItem key={tag}>
          <PrimaryTag>{tag}</PrimaryTag>
        </WrapItem>
      ))}
    </Wrap>
  </>
));
export default PrimaryTags;
