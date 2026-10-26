import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

const AVATAR_SIZE = 36;

/**
 * Circular avatar with the first letter of the given name, using the app
 * primary color. It follows the design system tokens instead of generating
 * arbitrary colors, so it is always readable and consistent across the app.
 *
 * @param {object} props
 * @param {string} props.name - Text to take the initial from (usually a display
 *   name such as "María García" → "M").
 * @param {number} [props.size=36] - Diameter in pixels.
 */
export default function UserAvatar({ name, size = AVATAR_SIZE }) {
  const initial = (name || '').trim().charAt(0).toUpperCase() || 'U';

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: '0.875rem',
        fontWeight: 600,
        bgcolor: theme => alpha(theme.palette.primary.main, 0.12),
        color: 'primary.main',
        border: '1px solid',
        borderColor: theme => alpha(theme.palette.primary.main, 0.24),
      }}
    >
      {initial}
    </Avatar>
  );
}
