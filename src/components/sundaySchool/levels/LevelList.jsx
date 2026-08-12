import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import {
  genericGetService,
  genericDeleteService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';
import ConfirmDialog from '../../shared/ConfirmDialog';
import showToast from '../../../customComponents/toast/showToast';
import LevelForm from './LevelForm';

const columns = [
  {
    id: 'name',
    label: 'Nombre',
    sortable: true,
    accessor: row => row.name?.toUpperCase() || '—',
  },
  {
    id: 'ages',
    label: 'Rango de edades',
    accessor: row =>
      row.minAge !== undefined && row.maxAge !== undefined
        ? `${row.minAge} – ${row.maxAge} años`
        : '—',
  },
  {
    id: 'teachers',
    label: 'Maestros',
    accessor: row => {
      const names = (row.teachers || [])
        .map(t => t?.fullName?.toUpperCase())
        .filter(Boolean);
      return names.length ? names.join(', ') : '—';
    },
  },
];

function LevelList() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const canCreate = usePermission('/sunday-school-levels', 'create_level');
  const canEdit = usePermission('/sunday-school-levels', 'edit_level');
  const canDelete = usePermission('/sunday-school-levels', 'delete_level');

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    const headers = getAuthHeaders(user.token);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/level`,
      headers,
    );
    if (data) setLevels(data);
    setLoading(false);
  }, [user.token]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const filteredData = useMemo(() => {
    if (!searchInput) return levels;
    const q = searchInput.toLowerCase();
    return levels.filter(
      level =>
        level.name?.toLowerCase().includes(q) ||
        (level.teachers || []).some(t =>
          t?.fullName?.toLowerCase().includes(q),
        ),
    );
  }, [levels, searchInput]);

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = row => {
    setSelectedItem(row);
    setFormOpen(true);
  };

  const handleView = row => {
    navigate(`/manage-sunday-school/${row._id}`, { state: { level: row } });
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchLevels();
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericDeleteService(
      `${B2C_BASE_URL}/sundaySchool/level/${itemToDelete._id}`,
      headers,
    );

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Error al eliminar el nivel');
      return;
    }

    showToast.success(
      'Nivel eliminado',
      'El nivel se ha eliminado correctamente',
    );
    setItemToDelete(null);
    fetchLevels();
  };

  const rowActions = ({ row }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
      {canEdit && (
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => handleEdit(row)}>
            <ModeEditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Ver detalle">
        <IconButton size="small" onClick={() => handleView(row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {canDelete && (
        <Tooltip title="Eliminar">
          <IconButton size="small" onClick={() => setItemToDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={filteredData}
        search={{
          value: searchInput,
          onChange: setSearchInput,
          placeholder: 'Buscar por nombre o maestro...',
        }}
        rowActions={rowActions}
        toolbarActions={
          canCreate && (
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Nuevo nivel
            </Button>
          )
        }
        emptyState="No se encontraron niveles"
        isLoading={loading}
      />
      <LevelForm
        open={formOpen}
        setOpen={setFormOpen}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
      <ConfirmDialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Eliminar nivel"
        description={`¿Está seguro de que desea eliminar el nivel "${
          itemToDelete?.name || ''
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

export default LevelList;
