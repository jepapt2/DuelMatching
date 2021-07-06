import { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme/theme';
import Router from './router/Router';

const App: FC = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ChakraProvider>
);

export default App;
