import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '../../shared/Alert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import { useLevels } from '../../../hooks/useLevels';
import {
  genericGetService,
  genericDeleteService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';
import ConfirmDialog from '../../shared/ConfirmDialog';
import showToast from '../../../customComponents/toast/showToast';
import ClassForm from './ClassForm';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return '—';
  }
}

const columns = [
  {
    id: 'lessonName',
    label: 'Clase',
    sortable: true,
    accessor: row => row.lessonName || '—',
  },
  {
    id: 'date',
    label: 'Fecha',
    sortable: true,
    accessor: row => formatDate(row.date),
  },
  {
    id: 'levels',
    label: 'Niveles',
    maxWidth: '220px',
    tooltip: true,
    accessor: row => {
      const names = (row.levelIds || []).map(l => l?.name).filter(Boolean);
      return names.length ? names.join(', ') : '—';
    },
  },
  {
    id: 'pdf',
    label: 'PDF',
    accessor: row =>
      row.pdfUrl ? (
        <Button
          size="small"
          startIcon={<PictureAsPdfIcon />}
          onClick={e => {
            e.stopPropagation();
            window.open(row.pdfUrl, '_blank', 'noopener,noreferrer');
          }}
          sx={{ textTransform: 'none' }}
        >
          Ver PDF
        </Button>
      ) : (
        '—'
      ),
  },
];

function ClassList() {
  const user = useSelector(state => state.user);
  const canCreate = usePermission('/sunday-school-classes', 'create_class');
  const canEdit = usePermission('/sunday-school-classes', 'edit_class');
  const canDelete = usePermission('/sunday-school-classes', 'delete_class');

  const { hasLevels } = useLevels();

  const [classes, setClasses] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchClasses = useCallback(
    async pageNum => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/class?${params}`,
        headers,
      );
      if (data) {
        setClasses(data.data || []);
        setTotalRecords(data.metadata?.totalRecords || 0);
      }
      setLoading(false);
    },
    [user.token],
  );

  useEffect(() => {
    fetchClasses(page);
  }, [fetchClasses, page]);

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = row => {
    setSelectedItem(row);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchClasses(page);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericDeleteService(
      `${B2C_BASE_URL}/sundaySchool/class/${itemToDelete._id}`,
      headers,
    );

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Error al eliminar la clase');
      return;
    }

    showToast.success(
      'Clase eliminada',
      'La clase se ha eliminado correctamente',
    );
    setItemToDelete(null);
    fetchClasses(page);
  };

  const rowActions =
    canEdit || canDelete
      ? ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            {canEdit && (
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => handleEdit(row)}>
                  <ModeEditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Eliminar">
                <IconButton size="small" onClick={() => setItemToDelete(row)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      : null;

  return (
    <Box>
      {canCreate && !hasLevels && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No hay niveles creados. Cree un nivel en la pestaña Gestión de Niveles
          para poder subir clases.
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={classes}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: setPage,
        }}
        rowActions={rowActions}
        toolbarActions={
          canCreate &&
          (hasLevels ? (
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Subir nueva clase
            </Button>
          ) : (
            <Tooltip title="Primero cree un nivel en la pestaña Gestión de Niveles">
              <span>
                <Button
                  variant="contained"
                  disabled
                  onClick={handleCreate}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                  Subir nueva clase
                </Button>
              </span>
            </Tooltip>
          ))
        }
        emptyState="No se encontraron clases"
        isLoading={loading}
      />
      <ClassForm
        open={formOpen}
        setOpen={setFormOpen}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
      <ConfirmDialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Eliminar clase"
        description={`¿Está seguro de que desea eliminar la clase "${
          itemToDelete?.lessonName || ''
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

export default ClassList;
