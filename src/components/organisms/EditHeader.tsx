import { memo, useState, VFC } from 'react';
import {
  Center,
  FormControl,
  FormLabel,
  Img,
  useToast,
  Input,
  Text,
  Box,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import Resizer from 'react-image-file-resizer';
import { db, storage } from '../../firebase';
import FormButton from '../atom/FormButton';

type Props = {
  valueHeader: string | undefined;
  userId: string;
};

const EditHeader: VFC<Props> = memo(({ valueHeader, userId }) => {
  const [header, setHeader] = useState<string>('');
  const [filename, setFilename] = useState<string>();
  const toast = useToast();

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        300,
        'JPEG',
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
      );
    });

  const onSubmitHeader = async () => {
    let toastMessage = { title: 'ヘッダーを更新しました', status: 'success' };
    try {
      await storage.ref(`headers/${userId}`).putString(header, 'data_url');
      const url = (await storage
        .ref('headers')
        .child(userId)
        .getDownloadURL()) as string;
      await db.collection('users').doc(userId).update({ header: url });
    } catch (error) {
      toastMessage = { title: 'アップロードに失敗しました', status: 'error' };
    } finally {
      setHeader('');
      setFilename('');
      toast({
        title: toastMessage.title,
        status: toastMessage.status as
          | 'success'
          | 'error'
          | 'info'
          | 'warning'
          | undefined,
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const onChangeHeader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileImage = e.target.files?.[0].name;
    setFilename(fileImage);
    const blobImage = e.target.files?.[0] as Blob;

    if (blobImage !== undefined) {
      if (/image.*/.exec(blobImage.type)) {
        const resizeImage = (await resizeFile(blobImage)) as string;
        setHeader(resizeImage);
      } else {
        toast({
          title: '画像のみアップロードできます',
          status: 'warning',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Center>
        <Img src={header || valueHeader} marginY="10px" />
      </Center>
      <Text color="header" marginBottom="5px" marginX="5px">
        ヘッダー
      </Text>

      <form onSubmit={onSubmitHeader}>
        <FormControl>
          <Flex marginX="5px" borderBottom="1px" borderColor="secondary">
            <FormLabel
              htmlFor="header"
              color="link"
              whiteSpace="nowrap"
              border="1px"
              borderColor="link"
              borderRadius="md"
              display="inline-block"
              padding="7px"
              height="40px"
              cursor="pointer"
            >
              ファイルを選択
              <Input
                display="none"
                type="file"
                id="header"
                name="header"
                placeholder="ヘッダー"
                onChange={onChangeHeader}
                accept="image/*"
              />
            </FormLabel>
            <Box
              paddingTop="8px"
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '200px',
              }}
            >
              {filename || '選択されていません'}
            </Box>

            <Spacer />
            <Box display="inline-block">
              <FormButton
                onClick={onSubmitHeader}
                display="inline-block"
                isDisabled={!filename}
              >
                更新する
              </FormButton>
            </Box>
          </Flex>
        </FormControl>
      </form>
    </>
  );
});

export default EditHeader;
