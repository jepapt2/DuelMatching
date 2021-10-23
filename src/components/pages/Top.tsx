import {
  Box,
  Button,
  Heading,
  Tooltip,
  Text,
  VStack,
  Link,
  Grid,
  Image,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Tr,
  Center,
} from '@chakra-ui/react';
import { memo, VFC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TopProfile from '../../image/TopProfile.png';
import TopRecruit from '../../image/TopRecruit.png';
import TopChat from '../../image/TopChat.png';
import { useLogin } from '../../hooks/useLoginUser';
import { twitterProvider } from '../../firebase';

const Top: VFC = memo(() => {
  const login = useLogin();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const onOpenImage = (i: string, t: string) => {
    setImage(i);
    setModalTitle(t);
    onOpen();
  };

  return (
    <>
      <Box bg="secondary" m={0} backgroundSize="170px" paddingBottom="40px">
        <Heading as="h1" size="2xl" display="inline-block" bg="link">
          DuelMatching
        </Heading>
        <br />
        <Heading
          marginTop="1.5em"
          marginX="5px"
          display="inline-block"
          as="h2"
          size="lg"
          bg="head"
          color="primary"
        >
          TCG用マッチングサイトはここだけ!
          <Tooltip label="2021年10月現在">
            <sup>※</sup>
          </Tooltip>
        </Heading>
        <br />
        <Heading
          marginTop="1.5em"
          marginX="5px"
          display="inline-block"
          as="h2"
          size="md"
          bg="head"
          color="primary"
        >
          対応タイトル:
          遊戯王,デュエマ,ポケカ,MTG,ヴァンガード,ヴァイス,Z/X,Lycee
          ,バディファイト,遊戯王ラッシュ
        </Heading>
        <VStack marginTop="3em" spacing="24px">
          <VStack
            bg="primary"
            width="300px"
            height="130px"
            borderRadius="lg"
            padding="20px"
          >
            <Button
              colorScheme="twitter"
              onClick={() => login(twitterProvider)}
            >
              Twitterアカウントでログイン
            </Button>
            <Text fontSize="sm">
              <Link as={RouterLink} color="blue.500" to="/tos">
                利用規約
              </Link>
              と
              <Link as={RouterLink} color="blue.500" to="/policie">
                プライバシーポリシー
              </Link>
              に同意の上ログインをお願いします
            </Text>
          </VStack>
          <VStack
            bg="primary"
            width="300px"
            height="100px"
            borderRadius="lg"
            padding="20px"
          >
            <Text color="link" fontWeight="bold">
              アプリ
            </Text>
            <Text color="red.500" fontWeight="bold">
              -準備中-
            </Text>
          </VStack>
        </VStack>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={3}
          marginTop="2em"
          marginX="5px"
        >
          <VStack
            w="100%"
            bg="primary"
            borderRadius="lg"
            padding="2px"
            onClick={() => onOpenImage(TopProfile, '充実したプロフィール')}
            cursor="pointer"
          >
            <Text fontWeight="bold" marginTop="10px">
              充実したプロフィール
            </Text>
            <Image src={TopProfile} />
          </VStack>
          <VStack
            w="100%"
            bg="primary"
            borderRadius="lg"
            padding="2px"
            onClick={() => onOpenImage(TopRecruit, '対戦募集機能')}
            cursor="pointer"
          >
            <Text fontWeight="bold" marginTop="10px">
              対戦募集機能
            </Text>
            <Image src={TopRecruit} />
          </VStack>
          <VStack
            w="100%"
            bg="primary"
            borderRadius="lg"
            padding="2px"
            onClick={() => onOpenImage(TopChat, '複数人対応のチャット')}
            cursor="pointer"
          >
            <Text fontWeight="bold" marginTop="10px">
              複数人対応のチャット
            </Text>
            <Image src={TopChat} />
          </VStack>
        </Grid>
        <Box bg="primary" borderRadius="lg" marginY="2em" marginX="5px">
          <Center>
            <Heading size="sm" marginTop="10px">
              更新履歴
            </Heading>
          </Center>

          <Table>
            <Tbody>
              <Tr>
                <Td>2021/10/25</Td>
                <Td>DuelMatchingリリース</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={image} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default Top;
