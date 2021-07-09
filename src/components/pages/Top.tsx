import { Box, Center, Heading } from '@chakra-ui/react';
import { memo, VFC } from 'react';
import PrimaryButton from '../atom/PrimaryButton';
import TopBg from '../../image/TopBg.png';
import { useLogin } from '../../hooks/useLoginUser';
import { twitterProvider } from '../../firebase';

const Top: VFC = memo(() => {
  const login = useLogin();

  return (
    <>
      <Box
        bg="secondary"
        m={0}
        backgroundImage={TopBg}
        backgroundSize="170px"
        backgroundPosition="95% 95%"
        backgroundRepeat="no-repeat"
      >
        <Heading as="h1" size="2xl" display="inline-block">
          DUELmatching
        </Heading>
        <br />
        <Heading
          marginTop="1.5em"
          marginLeft="5px"
          display="inline-block"
          as="h2"
          size="lg"
          bg="head"
          color="primary"
        >
          多機能TCGマッチングアプリ
        </Heading>
        <br />
        <Heading
          marginTop="1.5em"
          marginLeft="5px"
          display="inline-block"
          as="h2"
          size="lg"
          bg="head"
          color="primary"
        >
          同じ趣味の仲間に出会える
        </Heading>
        <br />
        <Heading
          marginTop="1.5em"
          marginBottom="1.5em"
          marginLeft="5px"
          display="inline-block"
          as="h2"
          size="lg"
          bg="head"
          color="primary"
        >
          完全無料で登録
        </Heading>
      </Box>
      <Center marginTop="1.5em">
        <PrimaryButton onClick={() => login(twitterProvider)}>
          Twitterアカウントでログイン
        </PrimaryButton>
      </Center>
    </>
  );
});

export default Top;
