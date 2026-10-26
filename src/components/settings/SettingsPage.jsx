import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { alpha } from '@mui/material/styles';
import { renderAppIcon } from '../../utils/iconResolver';
import SettingsChurchInfo from './SettingsChurchInfo';
import SettingsServices from './SettingsServices';
import SettingsWorkfronts from './SettingsWorkfronts';
import SettingsFamilyGroupTypes from './SettingsFamilyGroupTypes';

const SECTIONS = [
  {
    id: 'church-info',
    label: 'Información de la iglesia',
    icon: 'church',
    content: <SettingsChurchInfo />,
  },
  {
    id: 'services',
    label: 'Servicios',
    icon: 'event',
    content: <SettingsServices />,
  },
  {
    id: 'workfronts',
    label: 'Frentes de trabajo',
    icon: 'groups',
    content: <SettingsWorkfronts />,
  },
  {
    id: 'family-group-types',
    label: 'Tipos de grupos familiares',
    icon: 'family_restroom',
    content: <SettingsFamilyGroupTypes />,
  },
];

export default function SettingsPage() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const activeSection = SECTIONS.find(section => section.id === activeId);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'flex-start',
      }}
    >
      <Box
        component="nav"
        aria-label="Secciones de configuración"
        sx={{
          width: { xs: '100%', md: 280 },
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          p: 1,
        }}
      >
        <List
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            overflowX: { xs: 'auto', md: 'visible' },
          }}
        >
          {SECTIONS.map(section => {
            const selected = section.id === activeId;

            return (
              <ListItemButton
                key={section.id}
                selected={selected}
                onClick={() => setActiveId(section.id)}
                sx={{
                  borderRadius: 1,
                  mb: { md: 0.5 },
                  mr: { xs: 0.5, md: 0 },
                  minWidth: { xs: 'max-content', md: '100%' },
                  whiteSpace: { xs: 'nowrap', md: 'normal' },
                  '&.Mui-selected': {
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                  {renderAppIcon(section.icon, { fontSize: 20 })}
                </ListItemIcon>
                <ListItemText
                  primary={section.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: selected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        {activeSection.content}
      </Box>
    </Box>
  );
}
