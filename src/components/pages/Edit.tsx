import { Box } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import ProfileTabs from '../molecules/ProfileTabs';

const Edit: VFC = memo(() => (
  <>
    <ProfileTabs index={0} />
    <Box>edit</Box>
  </>
));

export default Edit;
