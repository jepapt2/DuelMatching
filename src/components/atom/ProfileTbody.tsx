import { Tbody, Tr, Td } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  field: string;
  value?: string;
};

const ProfileTbody: VFC<Props> = memo((props) => {
  const { field, value } = props;

  return (
    <>
      {value ? (
        <Tbody>
          <Tr>
            <Td>{field}</Td>
            <Td>{value}</Td>
          </Tr>
        </Tbody>
      ) : (
        <></>
      )}
    </>
  );
});
export default ProfileTbody;
