import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { keyframes } from '@mui/system';
import { alpha } from '@mui/material/styles';
import ModuleHeader from '../shared/ModuleHeader';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function SkeletonCard({ height, width }) {
  return (
    <Box
      sx={{
        height: height || 120,
        width: width || '100%',
        borderRadius: 2,
        border: '1.5px dashed',
        borderColor: theme => alpha(theme.palette.divider, 0.5),
        bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
      }}
    />
  );
}

function Dashboard() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ModuleHeader
        title="Inicio"
        description="Panel principal de control del sistema"
      />

      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr',
              gap: 3,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SkeletonCard height={100} />
              <SkeletonCard height={100} />
              <SkeletonCard height={100} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SkeletonCard height={180} />
              <SkeletonCard height={120} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SkeletonCard height={140} />
              <SkeletonCard height={140} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: { xs: 'block', lg: 'none' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              height: '100%',
            }}
          >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
                mb: 3,
              }}
            >
              {[BarChartIcon, PieChartIcon, TrendingUpIcon, PeopleAltIcon].map(
                (Icon, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'background.paper',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 22,
                        color: theme => alpha(theme.palette.text.disabled, 0.5),
                      }}
                    />
                  </Box>
                ),
              )}
            </Box>

            <Box
              sx={{
                maxWidth: 420,
                mx: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(8px)',
                px: { xs: 4, sm: 5 },
                py: { xs: 3.5, sm: 4 },
              }}
            >
              <Chip
                icon={
                  <SettingsIcon
                    sx={{
                      fontSize: 15,
                      animation: `${spin} 3s linear infinite`,
                    }}
                  />
                }
                label="En Configuración"
                size="small"
                sx={{
                  mb: 2,
                  bgcolor: theme => alpha(theme.palette.warning.main, 0.12),
                  color: 'warning.dark',
                  fontWeight: 600,
                  fontSize: 12,
                  '& .MuiChip-icon': { ml: 0.5 },
                }}
              />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Panel de Control Próximamente
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 320, mx: 'auto' }}
              >
                Estamos preparando tus indicadores y accesos rápidos
                personalizados.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
