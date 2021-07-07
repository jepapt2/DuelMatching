import { FC } from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme/theme';
import Router from './router/Router';

const App: FC = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Container p={0}>
        <Router />
      </Container>
    </BrowserRouter>
  </ChakraProvider>
);

export default App;
