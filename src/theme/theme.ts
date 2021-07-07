import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    head: '#0d0d0d',
    paragraph: '#2a2a2a',
    primary: '#fffffe',
    secondary: '#eff0f3',
    link: '#ff8e3c',
  },
  fonts: {
    body: 'Helvetica Neue,Arial,Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif',
    heading:
      'Helvetica Neue,Arial,Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif',
    mono: 'Helvetica Neue,Arial,Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif',
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
