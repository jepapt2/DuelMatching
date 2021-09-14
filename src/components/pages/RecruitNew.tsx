/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, memo, VFC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Select,
  Box,
  HStack,
  Checkbox,
  Text,
  Textarea,
} from '@chakra-ui/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ja } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';
import PlayTitle from '../../types/playTitle';
import SelectAdress from '../atom/SelectAdress';
import Recruit from '../../types/Recruit';
import { db } from '../../firebase';
import viewRecruit from '../../types/viewRecruit';

const RecruitNew: VFC = memo(() => {
  const { id, name, avatar, adress, playTitle } = useContext(AuthContext);

  const history = useHistory();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<viewRecruit>({ shouldUnregister: false });

  registerLocale('ja', ja);

  const ExampleCustomInput = React.forwardRef<
    HTMLButtonElement,
    JSX.IntrinsicElements['button']
  >(({ value, onClick }, ref) => (
    <Button className="example-custom-input" onClick={onClick} ref={ref}>
      {value || '日付を入力'}
    </Button>
  ));

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

  let selectPlayTitle = playTitleArray;

  if (playTitle?.length) {
    const playTitleCheck = playTitleArray.filter(
      (i) => playTitle.indexOf(i) === -1,
    );
    selectPlayTitle = [...playTitle, ...playTitleCheck];
  }

  const onSubmit: SubmitHandler<Recruit> = async (data) => {
    await db
      .collection('groups')
      .add({
        title: data.title,
        playTitle: data.playTitle,
        format: data.format || '',
        recruitNumber: Number(data.recruitNumber),
        place: data.place,
        point: data.point,
        start: data.start,
        end: data.end || '',
        limit: data.limit,
        overview: data.overview || '',
        friendOnly: data.friendOnly,
        memberCount: 0,
        organizerId: id,
        full: false,
        createdAt: new Date(),
        cancel: false,
      })
      .then(async (docref) => {
        await db
          .collection('groups')
          .doc(docref.id)
          .collection('members')
          .doc(id)
          .set({
            uid: id,
            name,
            avatar,
            organizer: true,
            createdAt: new Date(),
          });
        history.push(`/recruit/${docref.id}`);
      });
  };

  return (
    <>
      <Box marginX="5px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel required htmlFor="title" marginTop="5px">
              タイトル
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Input
              bg="secondary"
              id="title"
              {...register('title', {
                required: 'タイトルは必ず入力してください',
                maxLength: { value: 30, message: 'タイトルは30文字までです' },
              })}
            />
            <FormErrorMessage>
              {errors.title?.type === 'required' && errors.title?.message}
              {errors.title?.type === 'maxLength' && errors.title?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.playTitle}>
            <FormLabel htmlFor="playTitle" marginTop="5px">
              プレイタイトル
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Select
              bg="secondary"
              defaultValue={playTitle?.[0]}
              placeholder="プレイタイトル"
              {...register('playTitle', {
                required: 'プレイタイトルは必ず入力してください',
              })}
            >
              {selectPlayTitle.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.playTitle?.type === 'required' &&
                errors.playTitle?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.format}>
            <FormLabel htmlFor="format" marginTop="5px">
              対戦形式
            </FormLabel>
            <Input
              bg="secondary"
              id="format"
              {...register('format', {
                maxLength: {
                  value: 15,
                  message: '対戦形式は10文字までです',
                },
              })}
            />
            <FormErrorMessage>
              {errors.format?.type === 'maxLength' && errors.format?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.place}>
            <FormLabel htmlFor="place" marginTop="5px">
              都道府県
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Select
              bg="secondary"
              defaultValue={adress}
              placeholder="都道府県"
              {...register('place', {
                required: '都道府県は必ず入力してください',
              })}
            >
              <SelectAdress />
            </Select>
            <FormErrorMessage>
              {errors.place?.type === 'required' && errors.place?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.point}>
            <FormLabel htmlFor="point" marginTop="5px">
              詳細な場所
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Input
              bg="secondary"
              {...register('point', {
                required: '詳細な場所は必ず入力してください',
                maxLength: { value: 30, message: '詳細な場所は30文字までです' },
              })}
            />
            <FormErrorMessage>
              {errors.point?.type === 'required' && errors.point?.message}
              {errors.point?.type === 'maxLength' && errors.point?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.recruitNumber}>
            <FormLabel htmlFor="recruitNumber" marginTop="5px">
              募集人数(15人まで)
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <HStack>
              <Input
                bg="secondary"
                id="recruitNumber"
                {...register('recruitNumber', {
                  required: '募集人数は必ず入力してください',
                  validate: {
                    max: (v) => Number(v) < 16,
                    min: (v) => Number(v) > 0,
                  },
                })}
                defaultValue={1}
              />
              <Button
                disabled={Number(watch('recruitNumber')) >= 15}
                onClick={() =>
                  setValue('recruitNumber', Number(watch('recruitNumber')) + 1)
                }
              >
                +
              </Button>
              <Button
                disabled={Number(watch('recruitNumber')) <= 1}
                onClick={() =>
                  setValue('recruitNumber', Number(watch('recruitNumber')) - 1)
                }
              >
                -
              </Button>
            </HStack>
            <FormErrorMessage>
              {errors.recruitNumber?.type === 'required' &&
                errors.recruitNumber?.message}
              {errors.recruitNumber?.type === 'min' &&
                '1以上で入力してください'}
              {errors.recruitNumber?.type === 'max' &&
                '15以下で入力してください'}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.friendOnly}>
            <FormLabel htmlFor="friendOnly" marginTop="5px">
              募集範囲
            </FormLabel>
            <Checkbox {...register('friendOnly')}>フレンドのみ</Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="start" marginTop="5px">
              開始時間
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Controller
              control={control}
              name="start"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  locale="ja"
                  dateFormat="yyyy-MM-dd HH:mm"
                  showTimeSelect
                  timeIntervals={10}
                  onChange={onChange}
                  selected={value as unknown as Date}
                  customInput={<ExampleCustomInput />}
                />
              )}
            />
            {errors.start?.type === 'required' && (
              <Text fontSize="sm" color="red.500">
                開始時間は必ず入力してください
              </Text>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="end" marginTop="5px">
              終了時間(未入力の場合は未定)
            </FormLabel>
            <Controller
              control={control}
              name="end"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  locale="ja"
                  dateFormat="yyyy-MM-dd HH:mm"
                  showTimeSelect
                  timeIntervals={10}
                  onChange={onChange}
                  selected={value as unknown as Date}
                  customInput={<ExampleCustomInput />}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="limit" marginTop="5px">
              募集期限
              <Text display="inline" color="red.500" ml="3px">
                *
              </Text>
            </FormLabel>
            <Controller
              control={control}
              name="limit"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  locale="ja"
                  dateFormat="yyyy-MM-dd HH:mm"
                  showTimeSelect
                  timeIntervals={10}
                  onChange={onChange}
                  selected={value as unknown as Date}
                  customInput={<ExampleCustomInput />}
                />
              )}
            />
            {errors.limit?.type === 'required' && (
              <Text fontSize="sm" color="red.500">
                開始時間は必ず入力してください
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.overview}>
            <FormLabel htmlFor="overview" marginTop="5px">
              概要
            </FormLabel>
            <Textarea
              bg="secondary"
              id="overview"
              {...register('overview', {
                maxLength: {
                  value: 1000,
                  message: '自己紹介は1000文字までです',
                },
              })}
            />
            <FormErrorMessage>
              {errors.overview?.type === 'maxLength' &&
                errors.overview?.message}
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
            募集する
          </Button>
        </form>
      </Box>
      {/* )} */}
    </>
  );
});

export default RecruitNew;
