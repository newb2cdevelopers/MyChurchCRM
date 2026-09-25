import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import MuiTooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parse, isValid, subDays } from 'date-fns';
import DateInput from '../../shared/DateInput';
import Select from '../../shared/Select';
import Button from '../../../customComponents/button';
import DataTable from '../../shared/DataTable';
import AttendanceViewModal from '../../shared/AttendanceViewModal';
import showToast from '../../../customComponents/toast/showToast';
import { useLevels } from '../../../hooks/useLevels';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import { getColombiaToday } from '../../../utils/dateUtils';

function formatDate(value) {
  if (!value) return '—';
  let raw = value;
  if (typeof raw === 'string' && raw.includes('T')) raw = raw.split('T')[0];
  const d = parse(raw, 'yyyy-MM-dd', new Date());
  return isValid(d) ? format(d, 'dd/MM/yyyy') : raw;
}

// Shortens a church service label for the chart axis, e.g.
// "Domingo 07:00 am" → "07:00 am". The full label is shown in the tooltip.
function shortService(service) {
  const parts = (service || '').split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : service;
}

const detailColumns = [
  {
    id: 'date',
    label: 'Fecha',
    accessor: row => formatDate(row.date),
  },
  {
    id: 'service',
    label: 'Culto',
    accessor: row => row.service || '—',
  },
  {
    id: 'levelName',
    label: 'Nivel',
    accessor: row => row.levelName || '—',
  },
  {
    id: 'lessonName',
    label: 'Clase enseñada',
    maxWidth: '200px',
    tooltip: true,
    accessor: row => row.lessonName || '—',
  },
  {
    id: 'teacherName',
    label: 'Maestro',
    accessor: row => row.teacherName || '—',
  },
  {
    id: 'attendeesCount',
    label: 'Asistentes',
    align: 'right',
    accessor: row => row.attendeesCount ?? 0,
  },
];

export default function SundaySchoolReports() {
  const theme = useTheme();
  const user = useSelector(state => state.user);
  const { levels } = useLevels();

  const today = getColombiaToday();
  const [startDate, setStartDate] = useState(
    format(subDays(today, 30), 'yyyy-MM-dd'),
  );
  const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));
  // 'all' is a non-empty sentinel so MUI renders the label shrunk and the
  // selected option ("Todos los niveles", etc.) is visible. The backend
  // receives no filter param when 'all' is selected.
  const [levelId, setLevelId] = useState('all');
  const [service, setService] = useState('all');
  const [teacherId, setTeacherId] = useState('all');

  const [services, setServices] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [viewRow, setViewRow] = useState(null);

  // Church services (the configured cultos) for the filter and the chart.
  useEffect(() => {
    if (!user.selectedChurchId) return;

    const fetchChurch = async () => {
      const headers = getAuthHeaders(user.token);
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/church/${user.selectedChurchId}`,
        headers,
      );
      if (data) {
        setServices((data.services || []).map(svc => `${svc.day} ${svc.time}`));
      }
    };
    fetchChurch();
  }, [user.selectedChurchId, user.token]);

  // Unique teachers across all church levels, for the filter.
  const teachers = useMemo(() => {
    const map = new Map();
    (levels || []).forEach(level => {
      (level.teachers || []).forEach(t => {
        if (t?._id && !map.has(t._id)) map.set(t._id, t.fullName || '');
      });
    });
    return Array.from(map, ([id, fullName]) => ({ _id: id, fullName }));
  }, [levels]);

  const fetchReport = useCallback(
    async filters => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: String((filters.page ?? 0) + 1),
        limit: String(pageSize),
      });
      if (filters.levelId && filters.levelId !== 'all') {
        params.set('levelId', filters.levelId);
      }
      if (filters.service && filters.service !== 'all') {
        params.set('service', filters.service);
      }
      if (filters.teacherId && filters.teacherId !== 'all') {
        params.set('teacherId', filters.teacherId);
      }

      const [data, error] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/reports/attendance?${params}`,
        headers,
      );
      setLoading(false);

      if (!error && data) {
        setReportData(data);
      } else {
        showToast.error(
          'Error',
          error?.message || 'No se pudo generar el reporte',
        );
      }
    },
    [user.token],
  );

  // Auto-generate the report on mount with the default date range.
  useEffect(() => {
    fetchReport({
      startDate: format(subDays(getColombiaToday(), 30), 'yyyy-MM-dd'),
      endDate: format(getColombiaToday(), 'yyyy-MM-dd'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReport]);

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      showToast.warning(
        'Fechas requeridas',
        'Selecciona el rango de fechas del reporte',
      );
      return;
    }
    if (startDate > endDate) {
      showToast.warning(
        'Rango inválido',
        'La fecha inicial no puede ser mayor que la final',
      );
      return;
    }
    setPage(0);
    fetchReport({ startDate, endDate, levelId, service, teacherId, page: 0 });
  };

  const handlePageChange = newPage => {
    setPage(newPage);
    fetchReport({
      startDate,
      endDate,
      levelId,
      service,
      teacherId,
      page: newPage,
    });
  };

  const summary = reportData?.summary;
  const kpis = [
    {
      label: 'Total asistencias',
      value: summary?.totalAttendees ?? 0,
    },
    {
      label: 'Promedio por domingo',
      value: summary?.averagePerSunday ?? 0,
    },
    {
      label: 'Niveles cubiertos',
      value: summary?.totalLevels ?? 0,
    },
    {
      label: 'Cultos con registro',
      value: summary?.totalServices ?? 0,
    },
  ];

  const byServiceData = reportData?.byService || [];
  const byLevelData = reportData?.byLevel || [];
  const records = reportData?.records || [];
  const totalRecords = reportData?.metadata?.totalRecords || 0;

  const rowActions = ({ row }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <MuiTooltip title="Ver asistentes">
        <IconButton size="small" onClick={() => setViewRow(row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </MuiTooltip>
    </Box>
  );

  const chartBarProps = {
    radius: [4, 4, 0, 0],
    maxBarSize: 28,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ minWidth: { xs: '100%', sm: 170 } }}>
              <DateInput
                label="Desde"
                value={startDate}
                onChange={setStartDate}
              />
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 170 } }}>
              <DateInput label="Hasta" value={endDate} onChange={setEndDate} />
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <Select
                label="Nivel"
                value={levelId}
                onChange={e => setLevelId(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Todos los niveles</MenuItem>
                {(levels || []).map(level => (
                  <MenuItem key={level._id} value={level._id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <Select
                label="Culto"
                value={service}
                onChange={e => setService(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Todos los cultos</MenuItem>
                {services.map(svc => (
                  <MenuItem key={svc} value={svc}>
                    {svc}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <Select
                label="Maestro"
                value={teacherId}
                onChange={e => setTeacherId(e.target.value)}
                size="small"
              >
                <MenuItem value="all">Todos los maestros</MenuItem>
                {teachers.map(teacher => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.fullName}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Button variant="primary" onClick={handleGenerate}>
                Generar reporte
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map(kpi => (
              <Grid item xs={6} sm={3} key={kpi.label}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {kpi.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {kpi.value.toLocaleString('es-CO')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Asistencia por culto
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={byServiceData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.divider}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="service"
                          tickFormatter={shortService}
                          tick={{
                            fontSize: 12,
                            fill: theme.palette.text.secondary,
                          }}
                          interval={0}
                          label={{
                            value: 'Culto',
                            position: 'insideBottom',
                            offset: -5,
                            fontSize: 12,
                            fill: theme.palette.text.secondary,
                          }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{
                            fontSize: 12,
                            fill: theme.palette.text.secondary,
                          }}
                          label={{
                            value: 'Asistencias',
                            angle: -90,
                            position: 'insideLeft',
                            fontSize: 12,
                            fill: theme.palette.text.secondary,
                          }}
                        />
                        <Tooltip
                          formatter={value => [
                            value.toLocaleString('es-CO'),
                            'Asistencias',
                          ]}
                          labelFormatter={label => label}
                        />
                        <Bar
                          dataKey="total"
                          fill={theme.palette.primary.main}
                          {...chartBarProps}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Asistencia por nivel
                  </Typography>
                  {byLevelData.length === 0 ? (
                    <Box
                      sx={{
                        height: 220,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No hay datos para los filtros seleccionados
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={byLevelData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="levelName"
                            tick={{
                              fontSize: 12,
                              fill: theme.palette.text.secondary,
                            }}
                            interval={0}
                            label={{
                              value: 'Nivel',
                              position: 'insideBottom',
                              offset: -5,
                              fontSize: 12,
                              fill: theme.palette.text.secondary,
                            }}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{
                              fontSize: 12,
                              fill: theme.palette.text.secondary,
                            }}
                            label={{
                              value: 'Asistencias',
                              angle: -90,
                              position: 'insideLeft',
                              fontSize: 12,
                              fill: theme.palette.text.secondary,
                            }}
                          />
                          <Tooltip
                            formatter={value => [
                              value.toLocaleString('es-CO'),
                              'Asistencias',
                            ]}
                            labelFormatter={label => label}
                          />
                          <Bar
                            dataKey="total"
                            fill={theme.palette.tertiary.main}
                            {...chartBarProps}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detail table */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Detalle por clase
              </Typography>
              <DataTable
                columns={detailColumns}
                data={records}
                pagination={{
                  page,
                  pageSize,
                  total: totalRecords,
                  onPageChange: handlePageChange,
                }}
                rowActions={rowActions}
                emptyState={{
                  message:
                    'No hay registros de asistencia para los filtros seleccionados',
                }}
              />
            </CardContent>
          </Card>
        </>
      )}

      <AttendanceViewModal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Asistentes de la clase"
        subtitle={
          viewRow
            ? `${formatDate(viewRow.date)} · ${viewRow.service || ''} · ${
                viewRow.levelName || ''
              }`
            : undefined
        }
        students={viewRow?.students || []}
      />
    </Box>
  );
}
