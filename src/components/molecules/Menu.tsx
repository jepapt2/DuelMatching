import { Link } from 'react-router-dom';
import { Container, Grid, Box, VStack, Text } from '@chakra-ui/react';
import { EmailIcon, Icon, Search2Icon } from '@chakra-ui/icons';
import { memo, VFC } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiFileTextFill } from 'react-icons/ri';

const Menu: VFC = memo(() => (
  <Container
    p={0}
    position="fixed"
    bottom="0"
    width="100%"
    height="50px"
    borderTop="1px"
    borderColor="secondary"
    bg="primary"
  >
    <Grid templateColumns="repeat(4, 1fr)" gap={0}>
      <Link to="/">
        <Box w="100%" h="10">
          <VStack spacing={0}>
            <EmailIcon h="25px" w="25px" color="head" />
            <Text fontSize="sm" color="head">
              通知
            </Text>
          </VStack>
        </Box>
      </Link>
      <Link to="/users">
        <Box w="100%" h="10">
          <VStack spacing={0}>
            <Search2Icon h="25px" w="25px" color="head" />
            <Text fontSize="sm" color="head">
              探す
            </Text>
          </VStack>
        </Box>
      </Link>
      <Link to="/">
        <Box w="100%" h="10">
          <VStack spacing={0}>
            <Icon as={RiFileTextFill} h="25px" w="25px" color="head" />
            <Text fontSize="sm" color="head">
              募集
            </Text>
          </VStack>
        </Box>
      </Link>
      <Link to="/profile/edit">
        <Box w="100%" h="10">
          <VStack spacing={0}>
            <Icon as={FaUser} h="25px" w="25px" color="head" />
            <Text fontSize="sm" color="head">
              プロフィール
            </Text>
          </VStack>
        </Box>
      </Link>
    </Grid>
  </Container>
));

export default Menu;
