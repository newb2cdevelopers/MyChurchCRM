import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '../../shared/Alert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { format, parse, isValid } from 'date-fns';
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
import StudentForm from './StudentForm';

function formatDate(value) {
  if (!value) return '—';
  let raw = value;
  if (typeof raw === 'string' && raw.includes('T')) raw = raw.split('T')[0];
  const d = parse(raw, 'yyyy-MM-dd', new Date());
  return isValid(d) ? format(d, 'dd/MM/yyyy') : raw;
}

const columns = [
  {
    id: 'documentNumber',
    label: 'Identificación',
    accessor: row => row.documentNumber || '—',
  },
  {
    id: 'name',
    label: 'Nombre completo',
    sortable: true,
    accessor: row => `${row.name || ''} ${row.lastName || ''}`.trim() || '—',
  },
  {
    id: 'level',
    label: 'Nivel',
    accessor: row => row.levelId?.name || '—',
  },
  {
    id: 'birthDate',
    label: 'Fecha de nacimiento',
    accessor: row => formatDate(row.birthDate),
  },
  {
    id: 'emergencyContactName',
    label: 'Contacto de emergencia',
    accessor: row => row.emergencyContactName || '—',
  },
  {
    id: 'emergencyContactPhone',
    label: 'Teléfono emergencia',
    accessor: row => row.emergencyContactPhone || '—',
  },
];

function StudentList() {
  const user = useSelector(state => state.user);
  const canCreate = usePermission('/sunday-school-students', 'create_student');
  const canEdit = usePermission('/sunday-school-students', 'edit_student');
  const canDelete = usePermission('/sunday-school-students', 'delete_student');

  const [students, setStudents] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // null = still loading; true/false once resolved (avoids flash of the enabled button).
  const [hasLevels, setHasLevels] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchStudents = useCallback(
    async (pageNum, search) => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      if (search) params.set('search', search);
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/student?${params}`,
        headers,
      );
      if (data) {
        setStudents(data.data || []);
        setTotalRecords(data.metadata?.totalRecords || 0);
      }
      setLoading(false);
    },
    [user.token],
  );

  useEffect(() => {
    fetchStudents(page, searchInput);
  }, [fetchStudents, page, searchInput]);

  // A student always belongs to a level, so creation is gated on levels existing.
  useEffect(() => {
    let cancelled = false;
    const fetchLevels = async () => {
      const headers = getAuthHeaders(user.token);
      const [data, error] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/level`,
        headers,
      );
      if (cancelled) return;
      if (error) {
        // On fetch failure keep creation available; backend and form still guard.
        setHasLevels(true);
        return;
      }
      setHasLevels(Array.isArray(data) && data.length > 0);
    };
    fetchLevels();
    return () => {
      cancelled = true;
    };
  }, [user.token]);

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
    fetchStudents(page, searchInput);
  };

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericDeleteService(
      `${B2C_BASE_URL}/sundaySchool/student/${itemToDelete._id}`,
      headers,
    );

    if (error || data?.isSuccessful === false) {
      showToast.error(
        'Error',
        data?.message || 'Error al eliminar el estudiante',
      );
      return;
    }

    showToast.success(
      'Estudiante eliminado',
      'El estudiante se ha eliminado correctamente',
    );
    setItemToDelete(null);
    fetchStudents(page, searchInput);
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
      {canCreate && hasLevels === false && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No hay niveles creados. Cree un nivel en la pestaña Gestión de Niveles
          para poder registrar estudiantes.
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={students}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por nombre, documento o nivel...',
        }}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: setPage,
        }}
        rowActions={rowActions}
        toolbarActions={
          canCreate &&
          hasLevels !== null &&
          (hasLevels ? (
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Nuevo estudiante
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
                  Nuevo estudiante
                </Button>
              </span>
            </Tooltip>
          ))
        }
        emptyState="No se encontraron estudiantes"
        isLoading={loading}
      />
      <StudentForm
        open={formOpen}
        setOpen={setFormOpen}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
      <ConfirmDialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Eliminar estudiante"
        description={`¿Está seguro de que desea eliminar a ${
          itemToDelete?.name || 'este estudiante'
        }? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

export default StudentList;
