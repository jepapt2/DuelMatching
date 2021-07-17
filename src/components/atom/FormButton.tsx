import { Button } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  children: string;
  onClick: () => void;
  isDisabled: boolean;
  display: string;
};

const FormButton: VFC<Props> = memo((props) => {
  const { children, onClick, isDisabled, display } = props;

  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      display={display}
      bg="link"
      color="primary"
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
export default FormButton;
