import Icon from '@mui/material/Icon';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PostAddIcon from '@mui/icons-material/PostAdd';

const legacyIcons = {
  aforoIcon: GroupsIcon,
  consolidacionIcon: GroupsIcon,
  addPersonIcon: PersonAddAlt1Icon,
  eventsIcon: CalendarMonthIcon,
  bulkIcon: PostAddIcon,
  confirmIcon: HowToRegIcon,
};

export function renderAppIcon(iconValue, sx) {
  if (!iconValue) {
    return <Icon sx={sx}>apps</Icon>;
  }

  if (typeof iconValue === 'string' && legacyIcons[iconValue]) {
    const Legacy = legacyIcons[iconValue];
    return <Legacy sx={sx} />;
  }

  if (typeof iconValue === 'string') {
    // Material Icons string, e.g. "groups", "badge".
    return <Icon sx={sx}>{iconValue}</Icon>;
  }

  return <Icon sx={sx}>apps</Icon>;
}
