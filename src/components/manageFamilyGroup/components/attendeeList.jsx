import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '../../shared/Select';
import MenuItem from '@mui/material/MenuItem';
import { parse, format, isValid } from 'date-fns';
import DateInput from '../../shared/DateInput';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import {
  genericGetService,
  genericPostService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL, DOCUMENT_TYPES } from '../../../constants';
import showToast from '../../../customComponents/toast/showToast';
import DataTable from '../../shared/DataTable';

export default function AttendeeList({ familyGroupId }) {
  const user = useSelector(state => state.user);
  const canAddMember = usePermission('/family-groups', 'add_group_member');
  const canEditMember = usePermission('/family-groups', 'edit_group_member');
  const canRemoveMember = usePermission(
    '/family-groups',
    'remove_group_member',
  );
  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [address, setAddress] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});

  const fetchMembers = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/familyGroup/${familyGroupId}`,
      headers,
    );
    if (data) setMembers(data.members || []);
  }, [familyGroupId, user.token]);

  useEffect(() => {
    if (familyGroupId) fetchMembers();
  }, [familyGroupId, fetchMembers]);

  const filteredData = useMemo(() => {
    if (!searchInput) return members;
    const q = searchInput.toLowerCase();
    return members.filter(m => m.name?.toLowerCase().includes(q));
  }, [members, searchInput]);

  const openCreate = () => {
    setEditingMember(null);
    setName('');
    setDocumentType('');
    setDocumentNumber('');
    setAddress('');
    setMobilePhone('');
    setEmail('');
    setBirthDate('');
    setStartingDate('');
    setComments('');
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = member => {
    setEditingMember(member);
    setName(member.name || '');
    setDocumentType(member.documentType || '');
    setDocumentNumber(member.documentNumber || '');
    setAddress(member.address || '');
    setMobilePhone(member.mobilePhone || '');
    setEmail(member.email || '');
    setBirthDate(member.birthDate || '');
    setStartingDate(member.startingDate || '');
    setComments(member.comments || '');
    setErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (!documentType) errs.documentType = 'Seleccione un tipo de documento';
    if (!documentNumber.trim()) {
      errs.documentNumber = 'El número de documento es obligatorio';
    } else if (!/^\d+$/.test(documentNumber)) {
      errs.documentNumber = 'Solo se permiten números';
    }
    if (mobilePhone && !/^\d+$/.test(mobilePhone)) {
      errs.mobilePhone = 'Solo se permiten números';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      memberId: editingMember?._id || null,
      name: name.trim(),
      documentNumber,
      documentType,
      address,
      mobilePhone,
      email,
      birthDate,
      startingDate,
      comments,
    };

    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericPostService(
      `${B2C_BASE_URL}/familyGroup/registerFamilyGroupMember/${familyGroupId}`,
      payload,
      headers,
    );

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Error al guardar');
      return;
    }

    if (data?.data?.members) setMembers(data.data.members);
    showToast.success(
      editingMember ? 'Integrante actualizado' : 'Integrante registrado',
      editingMember
        ? 'El integrante se ha actualizado exitosamente'
        : 'El integrante se ha registrado exitosamente',
    );
    setFormOpen(false);
  };

  const columns = [
    {
      id: 'name',
      label: 'Nombre',
      accessor: row => row.name || '—',
    },
    {
      id: 'documentNumber',
      label: 'Identificación',
      accessor: row => row.documentNumber || '—',
    },
    {
      id: 'mobilePhone',
      label: 'Celular',
      accessor: row => row.mobilePhone || '—',
    },
    {
      id: 'email',
      label: 'Correo',
      accessor: row => row.email || '—',
    },
    {
      id: 'birthDate',
      label: 'Fecha de nacimiento',
      accessor: row => {
        if (!row.birthDate) return '—';
        let raw = row.birthDate;
        if (typeof raw === 'string' && raw.includes('T')) {
          raw = raw.split('T')[0];
        }
        const d = parse(raw, 'yyyy-MM-dd', new Date());
        return isValid(d) ? format(d, 'dd/MM/yyyy') : raw;
      },
    },
  ];

  const rowActions =
    canEditMember || canRemoveMember
      ? ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            {canEditMember && (
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => openEdit(row)}>
                  <ModeEditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {canRemoveMember && (
              <Tooltip title="Eliminar">
                <IconButton size="small" onClick={() => {}}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      : null;

  return (
    <Box>
      <DataTable
        columns={columns}
        data={filteredData}
        search={{
          value: searchInput,
          onChange: setSearchInput,
          placeholder: 'Buscar por nombre...',
        }}
        rowActions={rowActions}
        toolbarActions={
          canAddMember && (
            <Button
              variant="contained"
              onClick={openCreate}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Agregar integrante
            </Button>
          )
        }
        emptyState="No hay integrantes registrados"
      />

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMember ? 'Editar Integrante' : 'Nuevo Integrante'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              size="small"
              required
            />
            <Select
              label="Tipo de documento"
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              error={!!errors.documentType}
              helperText={errors.documentType}
              size="small"
              required
            >
              {DOCUMENT_TYPES.map(dt => (
                <MenuItem key={dt.value} value={dt.value}>
                  {dt.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Número de documento"
              value={documentNumber}
              onChange={e =>
                setDocumentNumber(e.target.value.replace(/\D/g, ''))
              }
              error={!!errors.documentNumber}
              helperText={errors.documentNumber}
              size="small"
              required
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Dirección"
              value={address}
              onChange={e => setAddress(e.target.value)}
              size="small"
            />
            <TextField
              label="Celular"
              value={mobilePhone}
              onChange={e => setMobilePhone(e.target.value.replace(/\D/g, ''))}
              error={!!errors.mobilePhone}
              helperText={errors.mobilePhone}
              size="small"
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              size="small"
              type="email"
            />
            <DateInput
              label="Fecha de nacimiento"
              value={birthDate}
              onChange={setBirthDate}
            />
            <DateInput
              label="Fecha de inicio"
              value={startingDate}
              onChange={setStartingDate}
            />
            <TextField
              label="Comentarios"
              value={comments}
              onChange={e => setComments(e.target.value)}
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
