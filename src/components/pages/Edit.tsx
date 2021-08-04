/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useContext, memo, VFC, useState } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Wrap,
  WrapItem,
  Spinner,
  Select,
  Box,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { db } from '../../firebase';
import ProfileTabs from '../molecules/ProfileTabs';
import { AuthContext } from '../providers/AuthContext';
import EditHeader from '../organisms/EditHeader';
import EditAvatar from '../organisms/EditAvatar';
import SecondaryButton from '../atom/SecondaryButton';
import User from '../../types/user';
import PlayTitle from '../../types/playTitle';
import PrimaryTag from '../atom/PrimaryTag';
import SelectAdress from '../atom/SelectAdress';

const Edit: VFC = memo(() => {
  const userId = useContext(AuthContext).id as string;
  const [inputValue, setInputValue] = useState<User>({
    name: '',
    avatar: '',
    header: '',
    comment: '',
    introduction: '',
    favorite: '',
    playTitle: [''],
    adress: '',
    activityDay: '',
    activityTime: '',
    sex: '',
    age: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  const history = useHistory();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<User>({ shouldUnregister: false });

  useEffect(() => {
    const unSub = db
      .collection('users')
      .doc(userId)
      .onSnapshot((doc) => {
        const data = doc.data() as Omit<User, 'playTitle'>;
        let playTitle: undefined | Array<PlayTitle> = [];
        // 配列で受け取った時
        if (Array.isArray(doc.data()?.playTitle)) {
          playTitle = doc.data()?.playTitle as Array<PlayTitle>;
          // 何も入ってなかった時
        } else if (doc.data()?.playTitle) {
          playTitle = undefined;
          // 文字列で受け取った時
        } else {
          const stringPlayTitle = doc.data()?.playTitle as string;
          playTitle = stringPlayTitle.split(',') as Array<PlayTitle>;
        }
        setInputValue({
          name: data?.name,
          avatar: data?.avatar,
          header: data?.header,
          comment: data?.comment,
          introduction: data?.introduction,
          favorite: data?.favorite,
          playTitle,
          adress: data?.adress,
          activityDay: data?.activityDay,
          activityTime: data?.activityTime,
          sex: data?.sex,
          age: data?.age,
        });
        setLoading(false);
      });

    return () => {
      unSub();
    };
  }, [userId]);

  let watchPlayTitle = inputValue.playTitle;

  const onSetPlayTitle = (t: PlayTitle) => {
    if (Array.isArray(watch('playTitle'))) {
      watchPlayTitle = watch('playTitle');
    } else {
      const a = watch('playTitle') as unknown as string;
      watchPlayTitle = a.split(',') as Array<PlayTitle>;
    }

    if (watchPlayTitle?.[0] === '') {
      watchPlayTitle = [t];
    } else {
      watchPlayTitle?.push(t);
    }

    const newPlayTitle = [...new Set<PlayTitle>(watchPlayTitle)];

    setInputValue({ playTitle: newPlayTitle });

    setValue('playTitle', newPlayTitle);
  };

  const playTitleArray: Array<PlayTitle> = [
    '遊戯王',
    'デュエマ',
    'ポケカ',
    'MTG',
    'ヴァンガード',
    'ヴァイス',
    'Z/X',
    'Lycee',
    'バディファイト',
    '遊戯王ラッシュ',
  ];

  const resetSetPlayTitle = () => {
    setInputValue({ playTitle: undefined });

    setValue('playTitle', undefined);
  };

  const playTitleError = errors.playTitle as FieldError | undefined;

  const onSubmit: SubmitHandler<User> = async (data) => {
    let playTitle: string | Array<PlayTitle> = '';
    if (Array.isArray(data.playTitle)) {
      playTitle = data.playTitle;
    } else {
      const stringPlayTitle = data.playTitle as unknown as string;
      playTitle = stringPlayTitle.split(',') as Array<PlayTitle>;
    }
    await db.collection('users').doc(userId).update({
      name: data.name,
      comment: data.comment,
      introduction: data.introduction,
      favorite: data.favorite,
      playTitle,
      adress: data.adress,
      activityDay: data.activityDay,
      activityTime: data.activityTime,
      sex: data.sex,
      age: data.age,
    });
    history.push('/profile');
  };

  return (
    <>
      <ProfileTabs index={0} />
      <EditHeader valueHeader={inputValue.header} userId={userId} />
      <EditAvatar valueAvatar={inputValue.avatar} userId={userId} />
      {loading ? (
        <Spinner />
      ) : (
        <Box marginX="5px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name" marginTop="5px">
                ユーザー名
              </FormLabel>
              <Input
                bg="secondary"
                id="name"
                defaultValue={inputValue.name}
                {...register('name', {
                  required: '名前は必ず入力してください',
                  maxLength: { value: 15, message: '名前は15文字までです' },
                })}
              />
              <FormErrorMessage>
                {errors.name?.type === 'required' && errors.name?.message}
                {errors.name?.type === 'maxLength' && errors.name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.comment}>
              <FormLabel htmlFor="comment" marginTop="5px">
                ひとこと
              </FormLabel>
              <Input
                bg="secondary"
                id="comment"
                defaultValue={inputValue.comment}
                {...register('comment', {
                  maxLength: { value: 30, message: 'ひとことは30文字までです' },
                })}
              />
              <FormErrorMessage>
                {errors.comment?.type === 'maxLength' &&
                  errors.comment?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.introduction}>
              <FormLabel htmlFor="introduction" marginTop="5px">
                自己紹介
              </FormLabel>
              <Textarea
                bg="secondary"
                id="introduction"
                defaultValue={inputValue.introduction}
                {...register('introduction', {
                  maxLength: {
                    value: 1000,
                    message: '自己紹介は1000文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.introduction?.type === 'maxLength' &&
                  errors.introduction?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.favorite}>
              <FormLabel htmlFor="favorite" marginTop="5px">
                好きなカード
              </FormLabel>
              <Input
                bg="secondary"
                id="favorite"
                defaultValue={inputValue.favorite}
                {...register('favorite', {
                  maxLength: {
                    value: 15,
                    message: '好きなカードは15文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.favorite?.type === 'maxLength' &&
                  errors.favorite?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.playTitle}>
              <FormLabel htmlFor="playTitle" marginTop="5px">
                プレイしているタイトル (頻度が高い順で入力)
              </FormLabel>
              <Wrap spacing="15px" marginBottom="15px">
                {playTitleArray.map((name) => (
                  <WrapItem key={name}>
                    <SecondaryButton onClick={() => onSetPlayTitle(name)}>
                      {name}
                    </SecondaryButton>
                  </WrapItem>
                ))}
              </Wrap>
              <SecondaryButton onClick={() => resetSetPlayTitle()}>
                リセット
              </SecondaryButton>
              <Box
                border="1px"
                borderColor="secondary"
                margin="10px"
                padding="7px"
              >
                {!!inputValue.playTitle?.length && (
                  <Wrap spacing="10px">
                    {inputValue.playTitle.map((name) => (
                      <WrapItem key={name}>
                        <PrimaryTag size="md">{name}</PrimaryTag>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
              </Box>
              <Input
                display="none"
                id="playTitle"
                defaultValue={inputValue.playTitle}
                {...register('playTitle', {
                  required: 'プレイしているタイトルは必ず入力してください',
                })}
              />
              <FormErrorMessage>
                {playTitleError?.type === 'required' && playTitleError?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.adress}>
              <FormLabel htmlFor="adress" marginTop="5px">
                居住地
              </FormLabel>
              <Select
                defaultValue={inputValue?.adress}
                placeholder="都道府県"
                {...register('adress')}
              >
                <SelectAdress />
              </Select>
            </FormControl>
            <FormControl isInvalid={!!errors.activityDay}>
              <FormLabel htmlFor="activityDay" marginTop="5px">
                活動日
              </FormLabel>
              <Input
                bg="secondary"
                id="favorite"
                defaultValue={inputValue.activityDay}
                {...register('activityDay', {
                  maxLength: {
                    value: 10,
                    message: '活動日の文字数は10文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.activityDay?.type === 'maxLength' &&
                  errors.activityDay?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.activityTime}>
              <FormLabel htmlFor="activityTime">活動時間</FormLabel>
              <Input
                bg="secondary"
                id="activityTime"
                defaultValue={inputValue.activityTime}
                {...register('activityTime', {
                  maxLength: {
                    value: 10,
                    message: '活動時間は10文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.activityTime?.type === 'maxLength' &&
                  errors.activityTime?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.age}>
              <FormLabel htmlFor="age" marginTop="5px">
                年齢
              </FormLabel>
              <Input
                bg="secondary"
                id="age"
                defaultValue={inputValue.age}
                {...register('age', {
                  maxLength: {
                    value: 5,
                    message: '年齢は5文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.age?.type === 'maxLength' && errors.age?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.sex}>
              <FormLabel htmlFor="sex" marginTop="5px">
                性別
              </FormLabel>
              <Input
                bg="secondary"
                id="sex"
                defaultValue={inputValue.sex}
                {...register('sex', {
                  maxLength: {
                    value: 10,
                    message: '性別は10文字までです',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.sex?.type === 'maxLength' && errors.sex?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              marginTop="30px"
              width="100%"
              bg="link"
              color="primary"
              isLoading={isSubmitting}
              type="submit"
              marginBottom="100px"
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
              更新する
            </Button>
          </form>
        </Box>
      )}
    </>
  );
});

export default Edit;
