import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PostAddIcon from '@mui/icons-material/PostAdd';

export const iconsProvider = {
  aforoIcon: <GroupsIcon sx={{ fontSize: 70 }} />,
  consolidacionIcon: <GroupsIcon sx={{ fontSize: 70 }} />,
  addPersonIcon: <PersonAddAlt1Icon sx={{ fontSize: 70 }} />,
  eventsIcon: <CalendarMonthIcon sx={{ fontSize: 70 }} />,
  bulkIcon: <PostAddIcon sx={{ fontSize: 70 }} />,
  confirmIcon: <HowToRegIcon sx={{ fontSize: 70 }} />,
};

export function resolveMaterialIconName(iconValue) {
  // Back-compat: if DB still sends a legacy key, keep using it.
  if (!iconValue) return null;
  if (typeof iconValue !== 'string') return null;

  if (iconsProvider[iconValue]) {
    return null;
  }

  // New format: Material Icons name string, e.g. "groups", "badge".
  return iconValue;
}
