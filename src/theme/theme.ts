import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    head: '#0d0d0d',
    paragraph: '#2a2a2a',
    link: '#ff8e3c',
    primary: '#fffffe',
    secondary: '#eff0f3',
  },
  styles: {
    global: {
      body: {
        backgroundColor: 'primary',
        color: 'paragraph',
      },
    },
  },
});

export default theme;
