import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Center,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react';

import { memo, VFC } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { CgCardHearts } from 'react-icons/cg';

import PlayTitle from '../../types/playTitle';

import PrimaryTags from './PrimaryTags';

type Props = {
  onClick: (id?: string) => void;
  id?: string;
  name?: string;
  avatar?: string;
  playTitle?: PlayTitle[];
  adress?: string;
  favorite?: string;
  activityDay?: string;
  activityTime?: string;
  comment?: string;
};

const UserCard: VFC<Props> = memo((props) => {
  const {
    onClick,
    id,
    name,
    avatar,
    playTitle,
    adress,
    favorite,
    activityDay,
    activityTime,
    comment,
  } = props;

  return (
    <Box
      bg="secondary"
      borderRadius="md"
      onClick={() => onClick(id)}
      padding="5px"
      cursor="pointer"
    >
      <Center>
        <Avatar src={avatar} />
      </Center>
      <List spacing={1} marginX="3px">
        <ListItem
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {name || 'unknown'}
        </ListItem>
        {playTitle && (
          <ListItem>
            <Center>
              <PrimaryTags playTitle={playTitle.slice(0, 3)} size="sm" />
            </Center>
          </ListItem>
        )}
        {adress && (
          <ListItem
            fontSize="sm"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <ListIcon as={AiFillHome} color="link" />
            {adress}
          </ListItem>
        )}
        {favorite && (
          <ListItem
            fontSize="sm"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <ListIcon as={CgCardHearts} color="link" />
            {favorite}
          </ListItem>
        )}
        {activityDay && (
          <ListItem
            fontSize="sm"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <ListIcon as={CalendarIcon} color="link" />
            {activityDay}
          </ListItem>
        )}
        {activityTime && (
          <ListItem
            fontSize="sm"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <ListIcon as={TimeIcon} color="link" />
            {activityTime}
          </ListItem>
        )}
        {comment && (
          <ListItem
            fontSize="sm"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {comment}
          </ListItem>
        )}
      </List>
    </Box>
  );
});

export default UserCard;
