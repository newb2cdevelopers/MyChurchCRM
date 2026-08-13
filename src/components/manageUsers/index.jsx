import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useSelector } from 'react-redux';
import { genericGetService, getAuthHeaders } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';
import DataTable from '../shared/DataTable';
import UserForm from './UserForm';

const columns = [
  {
    id: 'fullName',
    label: 'Nombre completo',
    accessor: row =>
      `${row.name || ''} ${row.lastName || ''}`.trim().toUpperCase(),
  },
  {
    id: 'email',
    label: 'Correo electrónico',
    accessor: row => row.email || '',
  },
  {
    id: 'active',
    label: 'Activo',
    width: '100px',
    accessor: row => (
      <Chip
        label={row.active ? 'Sí' : 'No'}
        color={row.active ? 'primary' : 'default'}
        size="small"
      />
    ),
  },
  {
    id: 'roles',
    label: 'Rol(es)',
    maxWidth: '220px',
    accessor: row =>
      row.roles?.length ? row.roles.map(r => r.name).join(', ') : 'Sin rol',
  },
];

function ManageUsers() {
  const user = useSelector(state => state.user);

  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchUsers = useCallback(
    async (pageNum, search) => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      if (search) params.set('search', search);
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/user?${params}`,
        headers,
      );
      if (data) {
        setUsers(data.data || []);
        setTotalRecords(data.metadata?.totalRecords || 0);
      }
      setLoading(false);
    },
    [user.token],
  );

  useEffect(() => {
    fetchUsers(page, searchInput);
  }, [fetchUsers, page, searchInput]);

  const handleEdit = row => {
    setSelectedItem(row);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchUsers(page, searchInput);
  };

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
  };

  const rowActions = ({ row }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
      <Tooltip title="Editar usuario">
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <ModeEditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={users}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por nombre o correo...',
        }}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: setPage,
        }}
        rowActions={rowActions}
        emptyState="No se encontraron usuarios"
        isLoading={loading}
      />
      <UserForm
        open={formOpen}
        setOpen={setFormOpen}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}

export default ManageUsers;
