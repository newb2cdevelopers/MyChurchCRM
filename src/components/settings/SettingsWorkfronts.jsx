import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '../../customComponents/button';
import TextField from '../shared/TextField';
import Select from '../shared/Select';
import DataTable from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import showToast from '../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  genericPutService,
  genericDeleteService,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

const STATUS_OPTIONS = ['Activo', 'Inactivo'];

const EMPTY_FORM = {
  name: '',
  moduleId: '',
  status: 'Activo',
  comments: '',
};

export default function SettingsWorkfronts() {
  const user = useSelector(state => state.user);

  const [workfronts, setWorkfronts] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWorkfronts = useCallback(async () => {
    if (!user.selectedChurchId) return;

    setLoading(true);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/workfront/workfrontsByChurch/${user.selectedChurchId}`,
    );
    setLoading(false);

    if (data) {
      const sorted = [...data].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return bTime - aTime;
      });
      setWorkfronts(sorted);
    }
  }, [user.selectedChurchId]);

  const fetchModules = useCallback(async () => {
    const [data] = await genericGetService(`${B2C_BASE_URL}/module`);
    if (data) {
      setModules(data);
    }
  }, []);

  useEffect(() => {
    fetchWorkfronts();
    fetchModules();
  }, [fetchWorkfronts, fetchModules]);

  const moduleNameById = useMemo(() => {
    const map = {};
    modules.forEach(m => {
      map[m._id] = m.name;
    });
    return map;
  }, [modules]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = workfront => {
    setEditingId(workfront._id);
    setForm({
      name: workfront.name || '',
      moduleId: workfront.moduleId || '',
      status: workfront.status || 'Activo',
      comments: workfront.comments || '',
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast.warning('Atención', 'El nombre del frente es obligatorio');
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      moduleId: form.moduleId || undefined,
      status: form.status,
      comments: form.comments.trim() || undefined,
    };

    const [data, error] = editingId
      ? await genericPutService(
          `${B2C_BASE_URL}/workfront/${editingId}`,
          payload,
        )
      : await genericPostService(`${B2C_BASE_URL}/workfront`, payload);

    setSaving(false);

    if (data) {
      showToast.success(
        'Éxito',
        editingId
          ? 'Frente de trabajo actualizado correctamente'
          : 'Frente de trabajo creado correctamente',
      );
      setFormOpen(false);
      fetchWorkfronts();
    } else {
      showToast.error(
        'Error',
        error?.message || 'No se pudo guardar el frente de trabajo',
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const [data, error] = await genericDeleteService(
      `${B2C_BASE_URL}/workfront/${deleteTarget._id}`,
    );
    setDeleting(false);

    if (data) {
      showToast.success(
        'Éxito',
        data.message || 'Frente de trabajo eliminado correctamente',
      );
      setDeleteTarget(null);
      fetchWorkfronts();
    } else {
      showToast.error(
        'Error',
        error?.message || 'No se pudo eliminar el frente de trabajo',
      );
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Nombre',
      accessor: row => row.name,
      sortable: true,
    },
    {
      id: 'module',
      label: 'Módulo',
      accessor: row => moduleNameById[row.moduleId] || '—',
    },
    {
      id: 'status',
      label: 'Estado',
      accessor: row => row.status || 'Activo',
    },
  ];

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Frentes de trabajo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona los frentes de trabajo de la iglesia
              </Typography>
            </Box>
            <Button variant="primary" onClick={openCreate}>
              Nuevo frente
            </Button>
          </Box>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={workfronts}
        isLoading={loading}
        rowActions={({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => openEdit(row)}
              sx={{ color: 'primary.main' }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteTarget(row)}
              sx={{ color: 'error.main' }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        emptyState={{ message: 'No hay frentes de trabajo configurados' }}
      />

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>
          {editingId ? 'Editar frente de trabajo' : 'Nuevo frente de trabajo'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Nombre"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
              size="small"
            />
            <Select
              label="Módulo"
              value={form.moduleId}
              onChange={e => setForm({ ...form, moduleId: e.target.value })}
              size="small"
            >
              <MenuItem value="">
                <em>Sin módulo</em>
              </MenuItem>
              {modules.map(m => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              label="Estado"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              size="small"
            >
              {STATUS_OPTIONS.map(s => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Comentarios"
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
              fullWidth
              size="small"
              multiline
              minRows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="ghost" onClick={() => setFormOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar frente de trabajo"
        description={`¿Estás seguro de que deseas eliminar el frente "${deleteTarget?.name}"? Los usuarios asignados quedarán sin frente.`}
        confirmText={deleting ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleDelete}
      />
    </Box>
  );
}
