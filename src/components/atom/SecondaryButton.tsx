import { Button } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
  onClick: () => void;
};

const SecondaryButton: VFC<Props> = memo((props) => {
  const { children, onClick } = props;

  return (
    <Button
      onClick={onClick}
      bg="primary"
      color="link"
      border="1px"
      borderColor="link"
      borderRadius="md"
      _active={{
        bg: 'secondary',
        transform: 'scale(0.98)',
      }}
      _focus={{
        bg: 'primary',
      }}
      _hover={{
        bg: 'primary',
      }}
    >
      {children}
    </Button>
  );
});
export default SecondaryButton;
