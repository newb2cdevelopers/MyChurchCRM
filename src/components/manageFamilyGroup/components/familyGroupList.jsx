import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';
import FamilyGroupForm from './familyGroupForm/familyGroupForm';

const columns = [
  {
    id: 'code',
    label: 'Código',
    sortable: true,
    accessor: row => row.code,
  },
  {
    id: 'leader',
    label: 'Líder principal',
    sortable: true,
    accessor: row => row.leader?.fullName?.toUpperCase() || '',
  },
  {
    id: 'address',
    label: 'Dirección',
    accessor: row => row.address || '',
  },
  {
    id: 'neighborhood',
    label: 'Barrio',
    accessor: row => row.neighborhood?.name || '',
  },
  {
    id: 'day',
    label: 'Día',
    accessor: row => row.day || '',
  },
  {
    id: 'time',
    label: 'Hora',
    accessor: row => row.time || '',
  },
  {
    id: 'phone',
    label: 'Celular',
    accessor: row => row.leader?.mobilePhone || '',
  },
  {
    id: 'status',
    label: 'Estado',
    sortable: true,
    accessor: row => row.status || '',
  },
];

function FamilyGroupList() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const canCreate = usePermission('/family-groups', 'create_group');
  const canEdit = usePermission('/family-groups', 'edit_group');

  const [familyGroups, setFamilyGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchFamilyGroups = useCallback(
    async (pageNum, search) => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      if (search) params.set('search', search);
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/familyGroup?${params}`,
        headers,
      );
      if (data) {
        setFamilyGroups(data.data || []);
        setTotalRecords(data.metadata?.totalRecords || 0);
      }
      setLoading(false);
    },
    [user.token],
  );

  useEffect(() => {
    fetchFamilyGroups(page, searchInput);
  }, [fetchFamilyGroups, page, searchInput]);

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
    fetchFamilyGroups(page, searchInput);
  };

  const handleView = row => {
    navigate(`/manage-family-groups/${row._id}`, { state: { group: row } });
  };

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
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
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={familyGroups}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por código, líder, dirección o día...',
        }}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: setPage,
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
              Nuevo grupo familiar
            </Button>
          )
        }
        emptyState="No se encontraron grupos familiares"
        isLoading={loading}
      />
      <FamilyGroupForm
        open={formOpen}
        setOpen={setFormOpen}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}

export default FamilyGroupList;
