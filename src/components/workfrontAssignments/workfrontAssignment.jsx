import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import DataTable from '../shared/DataTable';
import ConfirmDialog from '../shared/ConfirmDialog';
import {
  genericGetService,
  getAuthHeaders,
  genericPostService,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

export default function WorkfrontAssignment() {
  const user = useSelector(state => state.user);

  const [userList, setUserList] = useState([]);
  const [frontList, setFrontlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFront, setSelectedFront] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const getAssignmentData = useCallback(async token => {
    return await genericGetService(
      `${B2C_BASE_URL}/workfront/assignmentData`,
      getAuthHeaders(token),
    );
  }, []);

  useEffect(() => {
    if (!user.selectedChurchId || !user.token) {
      return;
    }

    let isMounted = true;

    setIsLoading(true);

    getAssignmentData(user.token).then(data => {
      if (!isMounted) return;

      setIsLoading(false);
      if (data[0]) {
        setUserList(
          data[0].data.Users.map(u => ({
            _id: u.Id,
            name: u.Name,
            currentWorkfront: u.CurrentWorkfront || 'Sin frente',
          })),
        );

        setFrontlist(
          data[0].data.Worfronts.map(w => ({
            value: w.Id,
            label: w.Name,
          })),
        );
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getAssignmentData, user.selectedChurchId, user.token]);

  const handleAssign = async () => {
    setSubmitting(true);

    const payload = {
      workfrontId: selectedFront.value,
      users: selectedUserIds,
    };

    const apiResult = await genericPostService(
      `${B2C_BASE_URL}/workfront/saveAssignment`,
      payload,
    );

    setSubmitting(false);
    setConfirmOpen(false);

    if (apiResult[0]) {
      setUserList(prev =>
        prev.map(u =>
          selectedUserIds.includes(u._id)
            ? { ...u, currentWorkfront: selectedFront.label }
            : u,
        ),
      );
      setSelectedFront(null);
      setSelectedUserIds([]);
      setSearch('');
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return userList;
    const q = search.toLowerCase();
    return userList.filter(u => u.name.toLowerCase().includes(q));
  }, [userList, search]);

  const selectedUsers = userList.filter(u => selectedUserIds.includes(u._id));

  const columns = [
    {
      id: 'name',
      label: 'Nombre',
      accessor: row => row.name,
      sortable: true,
    },
    {
      id: 'currentWorkfront',
      label: 'Frente actual',
      accessor: row => (
        <Typography
          variant="body2"
          sx={{
            color:
              row.currentWorkfront === 'Sin frente'
                ? 'text.secondary'
                : 'text.primary',
          }}
        >
          {row.currentWorkfront}
        </Typography>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            1
          </Box>
          Seleccionar Frente
        </Typography>
        <Paper
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: '16px',
            border: '1px solid #f1f1f1',
            boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Autocomplete
            options={frontList}
            value={selectedFront}
            onChange={(e, newValue) => setSelectedFront(newValue)}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            }
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Elegir frente..."
                size="small"
                hiddenLabel
                sx={{
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    display: 'none',
                  },
                }}
              />
            )}
            fullWidth
            disableClearable
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Resumen
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Frente:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedFront ? selectedFront.label : 'No seleccionado'}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Miembros:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedUserIds.length}
              </Typography>
            </Box>
            {selectedUsers.length > 0 && (
              <Box
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}
              >
                {selectedUsers.map(u => (
                  <Chip
                    key={u._id}
                    label={u.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setConfirmOpen(true)}
              disabled={!selectedFront || selectedUserIds.length === 0}
            >
              Confirmar Asignación
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                setSelectedFront(null);
                setSelectedUserIds([]);
                setSearch('');
              }}
              disabled={!selectedFront && selectedUserIds.length === 0}
              sx={{ color: 'text.secondary' }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            2
          </Box>
          Seleccionar Miembros
        </Typography>
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Buscar miembros...',
          }}
          selection={{
            selected: selectedUserIds,
            onSelectionChange: setSelectedUserIds,
            getRowId: row => row._id,
          }}
          toolbarActions={
            <ButtonBase
              onClick={() => {
                setSelectedUserIds(prev => {
                  const newIds = [...prev];
                  filteredUsers.forEach(u => {
                    if (!newIds.includes(u._id)) newIds.push(u._id);
                  });
                  return newIds;
                });
              }}
              sx={{
                typography: 'body2',
                fontWeight: 600,
                color: 'primary.main',
                whiteSpace: 'nowrap',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Marcar todos
            </ButtonBase>
          }
          emptyState={{
            message: search
              ? 'No se encontraron miembros'
              : 'No hay miembros disponibles',
          }}
        />
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar asignación"
        description={`¿Estás seguro de que deseas asignar el frente "${selectedFront?.label}" a ${selectedUserIds.length} usuario${selectedUserIds.length !== 1 ? 's' : ''}?`}
        confirmText={submitting ? 'Asignando...' : 'Asignar'}
        cancelText="Cancelar"
        confirmColor="primary"
        onConfirm={handleAssign}
      />
    </Box>
  );
}
