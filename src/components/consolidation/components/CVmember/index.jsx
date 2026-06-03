import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import CallIcon from '@mui/icons-material/Call';
import ModuleTabs from '../../../shared/ModuleTabs';
import DataTable from '../../../shared/DataTable';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5, textAlign: 'left', width: '100%' }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ textAlign: 'left', width: '100%' }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.75, md: 1 },
        mb: { xs: 2, md: 2.5 },
      }}
    >
      {icon}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="text.primary"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {title}
      </Typography>
    </Box>
  );
}

const academicColumns = [
  { id: 'name', label: 'Título', accessor: row => row.name || '—' },
  {
    id: 'institution',
    label: 'Institución',
    accessor: row => row.AcademicInstitutionName || '—',
  },
  {
    id: 'status',
    label: 'Estado',
    accessor: row =>
      row.isFinished ? (
        <Chip
          label="Completado"
          size="small"
          color="success"
          variant="outlined"
        />
      ) : (
        <Chip label="En curso" size="small" color="info" variant="outlined" />
      ),
  },
  {
    id: 'comments',
    label: 'Observaciones',
    accessor: row => row.comments || '—',
  },
];

const ministryColumns = [
  { id: 'name', label: 'Curso', accessor: row => row.name || '—' },
  {
    id: 'startDate',
    label: 'Inicio',
    accessor: row => formatDate(row.startDate),
  },
  {
    id: 'endDate',
    label: 'Fin',
    accessor: row => formatDate(row.endDate),
  },
  {
    id: 'status',
    label: 'Estado',
    accessor: row => {
      if (!row.status) return '—';
      const chipMap = {
        Terminado: { label: 'Terminado', color: 'success' },
        'En curso': { label: 'En curso', color: 'info' },
        Cancelado: { label: 'Cancelado', color: 'error' },
      };
      const chip = chipMap[row.status] || {
        label: row.status,
        color: 'default',
      };
      return (
        <Chip
          label={chip.label}
          size="small"
          color={chip.color}
          variant="outlined"
        />
      );
    },
  },
  { id: 'comments', label: 'Notas', accessor: row => row.comments || '—' },
];

export default function CvMember() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const selectedMember = useSelector(state => state.members.selectedMemberData);

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const identifier = selectedMember?._id || selectedMember?.documentNumber;
    if (!identifier || !user.token) {
      navigate('/', { replace: true });
      return;
    }
    const isSearchById = Boolean(selectedMember?._id);
    genericGetService(
      `${B2C_BASE_URL}/member/getMemberByIdentifier/${isSearchById}/${identifier}`,
      getAuthHeaders(user.token),
    )
      .then(([data]) => {
        setMember(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Miembro no encontrado
        </Typography>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Volver al listado
        </Button>
      </Box>
    );
  }

  const tabs = [
    {
      label: 'Información General',
      content: (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: { xs: 2, md: 3 } }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader
                  icon={<PersonIcon fontSize="small" color="primary" />}
                  title="Identidad"
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow label="Nombre completo" value={member.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Documento"
                      value={`${member.documentType || 'CC'} ${member.documentNumber || ''}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Fecha de nacimiento"
                      value={formatDate(member.birthDate)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Estado civil"
                      value={member.maritalStatus}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: { xs: 2, md: 3 } }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader
                  icon={<AlternateEmailIcon fontSize="small" color="primary" />}
                  title="Contacto"
                />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InfoRow label="Dirección" value={member.address} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow label="Celular" value={member.mobilePhone} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow label="Correo electrónico" value={member.email} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader
                  icon={<DescriptionIcon fontSize="small" color="primary" />}
                  title="Observaciones"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: 'italic',
                    bgcolor: 'surface.containerLowest',
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 1,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {member.comments || 'Sin observaciones registradas.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: { xs: 2, md: 3 } }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader
                  icon={<AutoAwesomeIcon fontSize="small" color="primary" />}
                  title="Vida en la Iglesia"
                />
                <Box
                  sx={{
                    '& > div:not(:last-child)': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: { xs: 1, md: 1.5 },
                      mb: { xs: 1, md: 1.5 },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'left' }}
                    >
                      Año de conversión
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ textAlign: 'right' }}
                    >
                      {member.conversionyear || '—'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'left' }}
                    >
                      Bautizado
                    </Typography>
                    <Chip
                      label={member.isBaptised ? 'Sí' : 'No'}
                      size="small"
                      color={member.isBaptised ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'left' }}
                    >
                      Frente de trabajo
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ textAlign: 'right' }}
                    >
                      {member.workfront?.name || '—'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'left' }}
                    >
                      Años en la iglesia
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ textAlign: 'right' }}
                    >
                      {member.yearInChurch || '—'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <SectionHeader
                  icon={<WorkIcon fontSize="small" color="primary" />}
                  title="Profesional"
                />
                <InfoRow
                  label="Nivel educativo"
                  value={member.educationalLevel}
                />
                <InfoRow label="Ocupación" value={member.occupation} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Familia',
      content: (
        <Box>
          {member.relatives?.length > 0 ? (
            <Grid container spacing={2}>
              {member.relatives.map((relative, index) => (
                <Grid item xs={12} sm={6} key={relative._id || index}>
                  <Card sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: { xs: 44, md: 56 },
                          height: { xs: 44, md: 56 },
                          borderRadius: '12px',
                          bgcolor: 'primary.container',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon
                          sx={{
                            color: 'primary.main',
                            fontSize: { xs: 22, md: 28 },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {relative.name}
                          </Typography>
                          <Chip
                            label={relative.kinship}
                            size="small"
                            sx={{ ml: 1, flexShrink: 0 }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <CallIcon
                            sx={{ fontSize: 14, color: 'primary.main' }}
                          />
                          <Typography variant="caption" color="primary">
                            {relative.mobilePhone || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: { xs: '6px 12px', md: '8px 16px' },
                        mt: { xs: 1.5, md: 2 },
                        pt: { xs: 1.5, md: 2 },
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Documento
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {relative.documentNumber || '—'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Ocupación
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {relative.occupation || '—'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Fecha de nacimiento
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {formatDate(relative.birthDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Correo electrónico
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {relative.email || '—'}
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: 'span 2' }}>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Dirección
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {relative.address || '—'}
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: 'span 2' }}>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 9, md: 10 },
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          Observaciones
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontStyle: 'italic',
                            textAlign: 'left',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          {relative.comments || '—'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 4 }}
            >
              No hay familiares registrados.
            </Typography>
          )}
        </Box>
      ),
    },
    {
      label: 'Estudios',
      content: (
        <DataTable
          columns={academicColumns}
          data={member.additionalAcademicStudies || []}
          emptyState={{ message: 'No hay estudios académicos registrados.' }}
        />
      ),
    },
    {
      label: 'Ministerio',
      content: (
        <DataTable
          columns={ministryColumns}
          data={member.ministryStudies || []}
          emptyState={{
            message: 'No hay formaciones ministeriales registradas.',
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto', overflowX: 'hidden' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 1.5,
          color: 'text.secondary',
          textTransform: 'none',
          '&:hover': { color: 'primary.main' },
        }}
      >
        Volver al listado
      </Button>

      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            mb: 0.5,
            textAlign: 'left',
            width: '100%',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {member.fullName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic', textAlign: 'left', width: '100%' }}
        >
          {member.documentType || 'CC'} {member.documentNumber}
        </Typography>
      </Box>

      <ModuleTabs
        tabs={tabs}
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
      />
    </Box>
  );
}
