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
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import ModuleTabs from '../../shared/ModuleTabs';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import LevelMembers from './LevelMembers';
import LevelAttendance from './LevelAttendance';

export default function LevelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchLevel = async () => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const [data, error] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/level/${id}`,
        headers,
      );
      if (!error && data) setLevel(data);
      setLoading(false);
    };
    if (id) fetchLevel();
  }, [id, user.token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!level) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Nivel no encontrado
        </Typography>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/module/sunday-school/sunday-school-levels')}
        >
          Volver al listado
        </Button>
      </Box>
    );
  }

  const tabs = [
    {
      label: 'Integrantes',
      content: <LevelMembers levelId={id} />,
    },
    {
      label: 'Asistencia',
      content: <LevelAttendance levelId={id} />,
    },
  ];

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/module/sunday-school/sunday-school-levels')}
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
          flexWrap: 'wrap',
          gap: 1,
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
          <SchoolIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {level.name?.toUpperCase()}
          </Typography>
          <Chip
            label={`${level.minAge} – ${level.maxAge} años`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 20, '& .MuiChip-label': { fontSize: 11, px: 0.75 } }}
          />
        </Box>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: '12px', mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1,
            }}
          >
            <GroupIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              sx={{ letterSpacing: 0.5 }}
            >
              Maestros asignados
            </Typography>
          </Box>
          {level.teachers?.length ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {level.teachers.map(teacher => (
                <Chip
                  key={teacher._id || teacher}
                  label={teacher.fullName?.toUpperCase() || '—'}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay maestros asignados a este nivel.
            </Typography>
          )}
        </CardContent>
      </Card>

      <ModuleTabs
        tabs={tabs}
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
      />
    </Box>
  );
}
