import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import Button from '../../customComponents/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { genericGetService, getAuthHeaders } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';
import { selectedMemberData } from '../../features/members/membersSlice';
import DataTable from '../shared/DataTable';
import FilterPopover from '../shared/FilterPopover';
import CreateMemberStepper from '../shared/CreateMemberStepper';

const STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo',
};

const STATUS_COLORS = {
  active: 'primary',
  inactive: 'default',
};

const columns = [
  {
    id: 'documentNumber',
    label: 'Identificación',
    sortable: true,
    accessor: row => row.documentNumber,
  },
  {
    id: 'fullName',
    label: 'Nombre completo',
    sortable: true,
    accessor: row => row.fullName?.toUpperCase() || '',
  },
  {
    id: 'workfront',
    label: 'Frente o área de trabajo',
    accessor: row => (row.workfront ? row.workfront.name : ''),
  },
  {
    id: 'address',
    label: 'Dirección',
    maxWidth: '220px',
    accessor: row => row.address || '',
  },
  {
    id: 'phone',
    label: 'Celular',
    accessor: row => row.mobilePhone || '',
  },
  {
    id: 'email',
    label: 'Correo',
    accessor: row => row.email || '',
  },
  {
    id: 'status',
    label: 'Estado',
    width: '110px',
    accessor: row => (
      <Chip
        label={STATUS_LABELS[row.status] || STATUS_LABELS.active}
        color={STATUS_COLORS[row.status] || STATUS_COLORS.active}
        size="small"
      />
    ),
  },
];

function ChurchMembersList() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [members, setMembers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const pageSize = 10;

  const fetchMembers = useCallback(
    (pageNum, search, status) => {
      if (!user.selectedChurchId) return;
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      genericGetService(`${B2C_BASE_URL}/member?${params}`, headers).then(
        data => {
          if (data[0]) {
            setMembers(data[0].data || []);
            setTotalRecords(data[0].metadata?.totalRecords || 0);
          }
          setLoading(false);
        },
      );
    },
    [user.selectedChurchId, user.token],
  );

  useEffect(() => {
    dispatch(selectedMemberData({ selectedMemberData: null }));
    fetchMembers(page, searchInput, statusFilter);
  }, [fetchMembers, page, searchInput, statusFilter, dispatch]);

  const handleEdit = document => {
    const member = members.find(m => m.documentNumber === document);
    if (member) {
      dispatch(selectedMemberData({ selectedMemberData: member }));
      setMemberToEdit(member);
      setEditModalOpen(true);
    }
  };

  const selectedMemberToEdit = (document, route) => {
    const _selectedMember = members.find(m => m.documentNumber === document);
    if (_selectedMember) {
      dispatch(selectedMemberData({ selectedMemberData: _selectedMember }));
    }
    navigate(route);
  };

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
  };

  const handleStatusFilterChange = value => {
    setStatusFilter(value);
    setPage(0);
  };

  const rowActions = ({ row }) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
        <Tooltip title="Editar">
          <IconButton
            size="small"
            onClick={() => handleEdit(row.documentNumber)}
          >
            <ModeEditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ver detalle">
          <IconButton
            size="small"
            onClick={() =>
              selectedMemberToEdit(row.documentNumber, '/cv-member')
            }
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box>
      <DataTable
        columns={columns}
        data={members}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por documento o nombre…',
        }}
        toolbarActions={
          <>
            <FilterPopover
              hideLabelOnMobile
              filters={[
                {
                  id: 'status',
                  label: 'Estado',
                  type: 'single',
                  value: statusFilter,
                  options: [
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' },
                  ],
                  onChange: handleStatusFilterChange,
                },
              ]}
              onClearAll={() => handleStatusFilterChange('')}
            />
            <Button
              variant="primary"
              onClick={() => setCreateModalOpen(true)}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Nuevo miembro
            </Button>
          </>
        }
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: setPage,
        }}
        emptyState={{
          message: searchInput
            ? 'No se encontraron miembros con ese criterio de búsqueda.'
            : 'No hay miembros registrados.',
        }}
        rowActions={rowActions}
        isLoading={loading}
      />
      <CreateMemberStepper
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          fetchMembers(page, searchInput, statusFilter);
        }}
      />
      <CreateMemberStepper
        open={editModalOpen}
        initialData={memberToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setMemberToEdit(null);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setMemberToEdit(null);
          fetchMembers(page, searchInput, statusFilter);
        }}
      />
    </Box>
  );
}

export default ChurchMembersList;
