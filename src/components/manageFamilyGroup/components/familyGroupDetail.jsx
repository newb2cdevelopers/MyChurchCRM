import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ModuleTabs from '../../shared/ModuleTabs';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import AttendeeList from './attendeeList';
import AttendanceList from './attendanceList';

const STATUS_COLORS = {
  Activo: 'success',
  Suspendido: 'warning',
  Cancelado: 'error',
};

export default function FamilyGroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const [data, error] = await genericGetService(
        `${B2C_BASE_URL}/familyGroup/${id}`,
        headers,
      );
      if (!error && data) setGroup(data);
      setLoading(false);
    };
    if (id) fetchGroup();
  }, [id, user.token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Grupo familiar no encontrado
        </Typography>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/module/family-groups')}
        >
          Volver al listado
        </Button>
      </Box>
    );
  }

  const tabs = [
    {
      label: 'Integrantes',
      content: <AttendeeList familyGroupId={id} />,
    },
    {
      label: 'Asistencias',
      content: <AttendanceList familyGroupId={id} />,
    },
  ];

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/module/family-groups')}
        sx={{ mb: { xs: 1.5, md: 2 }, textTransform: 'none' }}
      >
        Volver al listado
      </Button>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: 500,
            }}
          >
            Grupo familiar
          </Typography>
          <Typography variant="caption" color="text.primary" fontWeight={600}>
            #{group.code}
          </Typography>
          <Chip
            label={group.status}
            size="small"
            color={STATUS_COLORS[group.status] || 'default'}
            sx={{ height: 20, '& .MuiChip-label': { fontSize: 11, px: 0.75 } }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Inicio: {group.startDate || '—'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            flexShrink: 0,
            alignSelf: 'flex-start',
          }}
        >
          <Card variant="outlined" sx={{ borderRadius: '12px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <PersonIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ letterSpacing: 0.5 }}
                >
                  Identidad
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Líder responsable
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {group.leader?.fullName?.toUpperCase() || '—'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Anfitrión
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {group.host || '—'}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ lineHeight: 1.3, mb: 0.25 }}
                >
                  Código
                </Typography>
                <Typography variant="body2">{group.code || '—'}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: '12px', mt: 1.5 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <AccessTimeIcon
                  sx={{ fontSize: 15, color: 'text.secondary' }}
                />
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ letterSpacing: 0.5 }}
                >
                  Horario
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Día
                  </Typography>
                  <Typography variant="body2">{group.day || '—'}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Hora
                  </Typography>
                  <Typography variant="body2">{group.time || '—'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card
            variant="outlined"
            sx={{ borderRadius: '12px', height: '100%' }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 15, color: 'text.secondary' }}
                />
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ letterSpacing: 0.5 }}
                >
                  Ubicación
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Zona
                  </Typography>
                  <Typography variant="body2">
                    {group.neighborhood?.locality?.zone?.name || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1.3, mb: 0.25 }}
                  >
                    Comuna
                  </Typography>
                  <Typography variant="body2">
                    {group.neighborhood?.locality?.name || '—'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ lineHeight: 1.3, mb: 0.25 }}
                >
                  Barrio
                </Typography>
                <Typography variant="body2">
                  {group.neighborhood?.name || '—'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ lineHeight: 1.3, mb: 0.25 }}
                >
                  Dirección
                </Typography>
                <Typography variant="body2">{group.address || '—'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <ModuleTabs
        tabs={tabs}
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
      />
    </Box>
  );
}
