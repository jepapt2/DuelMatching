import { Button } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
};

const PrimaryButton: VFC<Props> = memo((props) => {
  const { children } = props;

  return (
    <Button
      bg="link"
      color="head"
      _active={{
        bg: 'link',
        transform: 'scale(0.98)',
      }}
      _focus={{
        bg: 'link',
      }}
      _hover={{
        bg: 'link',
      }}
    >
      {children}
    </Button>
  );
});
export default PrimaryButton;
