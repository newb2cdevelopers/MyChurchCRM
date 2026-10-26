import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { format, parse, isValid } from 'date-fns';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '../../customComponents/button';
import Select from '../shared/Select';
import TimeInput from '../shared/TimeInput';
import DataTable from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import showToast from '../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPutService,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

const DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Converts "HH:mm" (TimeInput) to the backend format "hh:mm am/pm".
function toAmPm(time) {
  if (!time) return '';
  const d = parse(time, 'HH:mm', new Date());
  return isValid(d) ? format(d, 'hh:mm a') : time;
}

// Converts "hh:mm am/pm" (backend) to "HH:mm" for the TimeInput.
function to24h(time) {
  if (!time) return '';
  const d = parse(time, 'hh:mm a', new Date());
  return isValid(d) ? format(d, 'HH:mm') : time;
}

export default function SettingsServices() {
  const user = useSelector(state => state.user);

  const [services, setServices] = useState([]);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const formRef = useRef(null);

  const fetchChurch = useCallback(async () => {
    if (!user.selectedChurchId) return;

    setLoading(true);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/church/${user.selectedChurchId}`,
    );
    setLoading(false);

    if (data) {
      setServices(data.services || []);
    }
  }, [user.selectedChurchId]);

  useEffect(() => {
    fetchChurch();
  }, [fetchChurch]);

  // Validates the selection, applies it and persists the full list.
  const handleAdd = async () => {
    if (!day || !time) {
      showToast.warning('Atención', 'Selecciona el día y la hora del servicio');
      return;
    }

    const formattedTime = toAmPm(time);
    const exists = services.some(
      (s, i) =>
        i !== editingIndex &&
        s.day === day &&
        s.time.toLowerCase() === formattedTime.toLowerCase(),
    );

    if (exists) {
      showToast.warning('Atención', 'Ese servicio ya está registrado');
      return;
    }

    const nextServices =
      editingIndex !== null
        ? services.map((s, i) =>
            i === editingIndex ? { day, time: formattedTime } : s,
          )
        : [...services, { day, time: formattedTime }];

    await persistServices(nextServices, editingIndex !== null);

    setEditingIndex(null);
    setDay('');
    setTime('');
  };

  const openEdit = index => {
    const service = services[index];
    setEditingIndex(index);
    setDay(service.day);
    setTime(to24h(service.time));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDay('');
    setTime('');
  };

  const handleRemove = async () => {
    if (deleteTarget === null) return;

    const nextServices = services.filter((_, i) => i !== deleteTarget);
    setDeleteTarget(null);
    await persistServices(nextServices, true);
  };

  const persistServices = async (nextServices, isUpdate) => {
    if (nextServices.length === 0) {
      showToast.warning('Atención', 'Agrega al menos un servicio');
      return;
    }

    setSaving(true);
    const [data, error] = await genericPutService(
      `${B2C_BASE_URL}/church/${user.selectedChurchId}/services`,
      { services: nextServices },
    );
    setSaving(false);

    if (data) {
      setServices(nextServices);
      showToast.success(
        'Éxito',
        data.message || 'Servicios actualizados correctamente',
      );
    } else {
      showToast.error(
        'Error',
        error?.message || 'No se pudieron guardar los servicios',
      );
      if (isUpdate) {
        // Nothing was persisted — restore the list from the server.
        fetchChurch();
      }
    }
  };

  const columns = [
    { id: 'day', label: 'Día', accessor: row => row.day },
    { id: 'time', label: 'Hora', accessor: row => row.time },
  ];

  return (
    <Box>
      <Card ref={formRef} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            {editingIndex !== null ? 'Editar servicio' : 'Agregar servicio'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <Select
                label="Día"
                value={day}
                onChange={e => setDay(e.target.value)}
                size="small"
              >
                {DAYS.map(d => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <TimeInput label="Hora" value={time} onChange={setTime} />
            </Box>
            <Button variant="secondary" onClick={handleAdd} disabled={saving}>
              {editingIndex !== null ? 'Guardar cambios' : 'Agregar'}
            </Button>
            {editingIndex !== null && (
              <Button variant="ghost" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={services}
        isLoading={loading}
        rowActions={({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => openEdit(services.indexOf(row))}
              disabled={saving}
              sx={{ color: 'primary.main' }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteTarget(services.indexOf(row))}
              disabled={saving}
              sx={{ color: 'error.main' }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        emptyState={{ message: 'No hay servicios configurados' }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar servicio"
        description={
          deleteTarget !== null
            ? `¿Estás seguro de que deseas eliminar el servicio "${services[deleteTarget]?.day} ${services[deleteTarget]?.time}"?`
            : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleRemove}
      />
    </Box>
  );
}
