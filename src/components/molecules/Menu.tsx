import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  VStack,
  Text,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { EmailIcon, Icon, Search2Icon } from '@chakra-ui/icons';
import { useState, memo, VFC, useEffect, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiFileTextFill } from 'react-icons/ri';
import { db } from '../../firebase';
import { AuthContext } from '../providers/AuthContext';

const Menu: VFC = memo(() => {
  const [notice, setNotice] = useState<number>(0);
  const { id } = useContext(AuthContext);

  useEffect(() => {
    const unSub = db
      .collection('users')
      .doc(id)
      .collection('notifications')
      .orderBy('updateAt', 'desc')
      .limit(30)
      .onSnapshot((snap) => {
        const noticeArray = snap.docs.filter((doc) => !doc.data().read);
        setNotice(noticeArray.length);
      });

    return () => {
      unSub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      p={0}
      position="fixed"
      bottom="0"
      width="100%"
      height="50px"
      borderTop="1px"
      borderColor="secondary"
      bg="primary"
      zIndex="1"
    >
      <Grid templateColumns="repeat(4, 1fr)" gap={0}>
        <Link to="/notice">
          <Box w="100%" h="10">
            <VStack spacing={0}>
              <Box position="relative">
                <EmailIcon h="25px" w="25px" color="head" />
                {!!notice && (
                  <Tag
                    size="sm"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="red"
                    position="absolute"
                    left="5"
                  >
                    <TagLabel>{notice}</TagLabel>
                  </Tag>
                )}
              </Box>
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
        <Link to="/recruits">
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
  );
});

export default Menu;
