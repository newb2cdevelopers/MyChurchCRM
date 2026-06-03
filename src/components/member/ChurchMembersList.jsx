import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
import CreateMemberStepper from '../shared/CreateMemberStepper';

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
];

function ChurchMembersList() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState({ columnId: null, direction: 'asc' });
  const [page, setPage] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const pageSize = 10;

  const fetchMembers = useCallback(() => {
    if (!user.selectedChurchId) return;
    const headers = getAuthHeaders(user.token);
    genericGetService(
      `${B2C_BASE_URL}/member?churchId=${user.selectedChurchId}`,
      headers,
    ).then(data => {
      if (data[0]) {
        setMembers(data[0]);
      }
    });
  }, [user.selectedChurchId, user.token]);

  useEffect(() => {
    dispatch(selectedMemberData({ selectedMemberData: null }));
    fetchMembers();
  }, [fetchMembers, dispatch]);

  const filteredData = useMemo(() => {
    let result = members;

    if (searchInput.length >= 2) {
      const query = searchInput.toLowerCase();
      result = result.filter(
        m =>
          m.documentNumber.toString().includes(query) ||
          m.fullName.toLowerCase().includes(query),
      );
    }

    if (sort.columnId) {
      result = [...result].sort((a, b) => {
        const aVal =
          columns.find(c => c.id === sort.columnId)?.accessor(a) || '';
        const bVal =
          columns.find(c => c.id === sort.columnId)?.accessor(b) || '';
        const cmp = String(aVal).localeCompare(String(bVal), 'es', {
          numeric: true,
        });
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [members, searchInput, sort]);

  const paginatedData = useMemo(
    () => filteredData.slice(page * pageSize, (page + 1) * pageSize),
    [filteredData, page],
  );

  const handleSortChange = (columnId, direction) => {
    setSort({ columnId, direction });
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
  };

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

  const rowActions = ({ row }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={() => handleEdit(row.documentNumber)}>
          <ModeEditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver detalle">
        <IconButton
          size="small"
          onClick={() => selectedMemberToEdit(row.documentNumber, '/cv-member')}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={paginatedData}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por documento o nombre…',
        }}
        sort={{
          columnId: sort.columnId,
          direction: sort.direction,
          onSortChange: handleSortChange,
        }}
        pagination={{
          page,
          pageSize,
          total: filteredData.length,
          onPageChange: handlePageChange,
        }}
        toolbarActions={
          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Nuevo miembro
          </Button>
        }
        emptyState={{
          message: searchInput
            ? 'No se encontraron miembros con ese criterio de búsqueda.'
            : 'No hay miembros registrados.',
        }}
        rowActions={rowActions}
      />
      <CreateMemberStepper
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          fetchMembers();
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
          fetchMembers();
        }}
      />
    </Box>
  );
}

export default ChurchMembersList;
