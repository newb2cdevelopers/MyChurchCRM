import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import MuiButton from '@mui/material/Button';
import ChurchIcon from '@mui/icons-material/Church';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../customComponents/button';
import PublicHeader from '../shared/PublicHeader';

function Landing() {
  return (
    <Box sx={{ bgcolor: 'background', minHeight: '100vh' }}>
      <PublicHeader>
        <Link
          component={RouterLink}
          to="/public-events"
          underline="none"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Eventos
        </Link>
        <Link
          component={RouterLink}
          to="/manageBookings"
          underline="none"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Reservas
        </Link>
        <Link
          component={RouterLink}
          to="/company-directory"
          underline="none"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Directorio
        </Link>
        <Button component={RouterLink} to="/login" size="small" sx={{ ml: 2 }}>
          Ingresar
        </Button>
      </PublicHeader>

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            bgcolor: 'rgba(94,57,224,0.08)',
            filter: 'blur(120px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 100,
            right: 50,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'rgba(200,190,255,0.3)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            maxWidth: '900px',
            mx: 'auto',
            textAlign: 'center',
            py: { xs: 12, md: 20 },
            px: { xs: 3, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Tu comunidad,{' '}
            <Box
              component="span"
              sx={{ color: 'primary.main', fontStyle: 'italic' }}
            >
              siempre conectada
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              mb: 5,
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            Gestiona eventos, reserva tu lugar y descubre servicios locales
            desde un solo lugar.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Button
              component={RouterLink}
              to="/public-events"
              size="large"
              sx={{ py: 1.75, px: 4, fontSize: 14, letterSpacing: '0.02em' }}
            >
              Explorar eventos
              <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="secondary"
              size="large"
              sx={{ py: 1.75, px: 4, fontSize: 14, letterSpacing: '0.02em' }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'white', py: { xs: 10, md: 16 } }}>
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 3, md: 6 },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
              Servicios Públicos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Todo lo que necesitas al alcance de un clic
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            <Box
              component={RouterLink}
              to="/public-events"
              sx={{
                textDecoration: 'none',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                p: 4,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: 'rgba(94,57,224,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Explorar Eventos
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                Descubre los eventos y actividades de las iglesias. Cultos,
                talleres y programas para toda la comunidad.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Explorar ahora
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>

            <Box
              component={RouterLink}
              to="/manageBookings"
              sx={{
                textDecoration: 'none',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                p: 4,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: 'rgba(94,57,224,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <EventAvailableIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Gestionar Reservas
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                Consulta o modifica tus reservas a eventos de manera rápida y
                sencilla.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Ver mis reservas
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>

            <Box
              component={RouterLink}
              to="/company-directory"
              sx={{
                textDecoration: 'none',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                p: 4,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  bgcolor: 'rgba(94,57,224,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <GroupsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Directorio de Empresas
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                Encuentra servicios y negocios recomendados por la comunidad
                cristiana.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Visitar directorio
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: 'primary.main',
          py: { xs: 10, md: 14 },
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: '700px',
            mx: 'auto',
            px: { xs: 3, md: 6 },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              mx: 'auto',
              mb: 4,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              lineHeight: 1.4,
              mb: 3,
            }}
          >
            "Donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de
            ellos."
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 6 }}>
            — Nuestra misión es fortalecer esos lazos a través de la tecnología.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <MuiButton
              component={RouterLink}
              to="/public-events"
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                py: 1.5,
                px: 4,
                fontSize: 14,
                letterSpacing: '0.02em',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Explorar eventos
            </MuiButton>
            <MuiButton
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                py: 1.5,
                px: 4,
                fontSize: 14,
                letterSpacing: '0.02em',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Iniciar sesión
            </MuiButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: 'background',
          py: 8,
          px: { xs: 3, md: 6 },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChurchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="caption" color="text.secondary">
              Sistema de gestión Mi Iglesia © {new Date().getFullYear()}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            "Cultivando fe a través de la conexión."
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;
