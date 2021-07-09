import { Button } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
  onClick: () => void;
};

const PrimaryButton: VFC<Props> = memo((props) => {
  const { children, onClick } = props;

  return (
    <Button
      onClick={onClick}
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
