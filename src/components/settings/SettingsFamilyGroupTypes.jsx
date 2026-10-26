import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '../../customComponents/button';
import TextField from '../shared/TextField';
import DataTable from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import showToast from '../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPutService,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

export default function SettingsFamilyGroupTypes() {
  const user = useSelector(state => state.user);

  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState('');
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
      setTypes(data.familyGroupTypes || []);
    }
  }, [user.selectedChurchId]);

  useEffect(() => {
    fetchChurch();
  }, [fetchChurch]);

  // Validates the value, applies it and persists the full list.
  const handleAdd = async () => {
    const trimmed = newType.trim();

    if (!trimmed) {
      showToast.warning(
        'Atención',
        'Escribe el nombre del tipo de grupo familiar',
      );
      return;
    }

    const exists = types.some(
      (t, i) => i !== editingIndex && t.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exists) {
      showToast.warning('Atención', 'Ese tipo ya está registrado');
      return;
    }

    const nextTypes =
      editingIndex !== null
        ? types.map((t, i) => (i === editingIndex ? trimmed : t))
        : [...types, trimmed];

    await persistTypes(nextTypes, editingIndex !== null);

    setEditingIndex(null);
    setNewType('');
  };

  const openEdit = index => {
    setEditingIndex(index);
    setNewType(types[index]);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewType('');
  };

  const handleRemove = async () => {
    if (deleteTarget === null) return;

    const nextTypes = types.filter((_, i) => i !== deleteTarget);
    setDeleteTarget(null);
    await persistTypes(nextTypes, true);
  };

  const persistTypes = async (nextTypes, isUpdate) => {
    if (nextTypes.length === 0) {
      showToast.warning(
        'Atención',
        'Agrega al menos un tipo de grupo familiar',
      );
      return;
    }

    setSaving(true);
    const [data, error] = await genericPutService(
      `${B2C_BASE_URL}/church/${user.selectedChurchId}/family-group-types`,
      { familyGroupTypes: nextTypes },
    );
    setSaving(false);

    if (data) {
      setTypes(nextTypes);
      showToast.success(
        'Éxito',
        data.message || 'Tipos de grupos familiares actualizados correctamente',
      );
    } else {
      showToast.error(
        'Error',
        error?.message ||
          'No se pudieron guardar los tipos de grupos familiares',
      );
      if (isUpdate) {
        // Nothing was persisted — restore the list from the server.
        fetchChurch();
      }
    }
  };

  const columns = [
    { id: 'type', label: 'Tipo de grupo familiar', accessor: row => row },
  ];

  return (
    <Box>
      <Card ref={formRef} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            {editingIndex !== null
              ? 'Editar tipo de grupo familiar'
              : 'Agregar tipo de grupo familiar'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ minWidth: { xs: '100%', sm: 300 }, flex: 1 }}>
              <TextField
                label="Tipo"
                value={newType}
                onChange={e => setNewType(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                fullWidth
                size="small"
                placeholder="Ej. Niños, Jóvenes, Adultos..."
              />
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
        data={types}
        isLoading={loading}
        rowActions={({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => openEdit(types.indexOf(row))}
              disabled={saving}
              sx={{ color: 'primary.main' }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteTarget(types.indexOf(row))}
              disabled={saving}
              sx={{ color: 'error.main' }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        emptyState={{
          message: 'No hay tipos de grupos familiares configurados',
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar tipo de grupo familiar"
        description={
          deleteTarget !== null
            ? `¿Estás seguro de que deseas eliminar el tipo "${types[deleteTarget]}"?`
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
