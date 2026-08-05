import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import {
  genericGetService,
  genericPutService,
  getAuthHeaders,
} from '../../api/externalServices';
import { B2C_BASE_URL, getDocumentTypeLabel } from '../../constants';
import MultiSelect from '../shared/MultiSelect';
import Select from '../shared/Select';

export default function UserForm({ open, setOpen, selectedItem, onSuccess }) {
  const user = useSelector(state => state.user);

  const [active, setActive] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [workfrontList, setWorkfrontList] = useState([]);
  const [selectedWorkfront, setSelectedWorkfront] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const headers = getAuthHeaders(user.token);
      genericGetService(`${B2C_BASE_URL}/role`, headers).then(([data]) => {
        if (data) setRolesList(data);
      });
      genericGetService(`${B2C_BASE_URL}/zone`).then(([data]) => {
        if (data) setZoneList(data);
      });
      genericGetService(`${B2C_BASE_URL}/workfront`).then(([data]) => {
        if (data) setWorkfrontList(data);
      });

      if (selectedItem) {
        setActive(selectedItem.active || false);
        setSelectedRoles(selectedItem.roles || []);
        setSelectedZone(selectedItem.zoneId?._id || selectedItem.zoneId || '');
        setSelectedWorkfront(
          selectedItem.workfront?._id || selectedItem.workfront || '',
        );
      } else {
        setActive(false);
        setSelectedRoles([]);
        setSelectedZone('');
        setSelectedWorkfront('');
      }
      setErrors({});
    }
  }, [open, selectedItem, user.token]);

  const handleRolesChange = roles => {
    setSelectedRoles(roles);
    setErrors(prev => ({ ...prev, roles: undefined }));
  };

  const handleZoneChange = e => {
    setSelectedZone(e.target.value);
    setErrors(prev => ({ ...prev, zone: undefined }));
  };

  const handleSave = async () => {
    const roleNames = selectedRoles.map(r => r.name);
    const hasCoordinatorRole = roleNames.includes(
      'Coordinador Grupos Familiares',
    );
    const hasLeaderRole = roleNames.includes('Líder Grupos Familiares');
    const newErrors = {};

    if (hasCoordinatorRole && !selectedZone) {
      newErrors.zone =
        'Debe seleccionar una zona para el coordinador de grupos familiares.';
    }

    if ((hasCoordinatorRole || hasLeaderRole) && !selectedItem.isMember) {
      newErrors.roles =
        'El usuario debe existir como miembro del sistema para asignarle este rol.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    const headers = getAuthHeaders(user.token);
    const payload = {
      active,
      roles: selectedRoles.map(r => r._id),
      zoneId: selectedZone || undefined,
      workfront: selectedWorkfront || undefined,
    };

    const [, error] = await genericPutService(
      `${B2C_BASE_URL}/user/${selectedItem._id}`,
      payload,
      headers,
    );

    setSaving(false);

    if (!error) {
      onSuccess();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const sortedRoles = [...rolesList]
    .filter(r => r.active !== false)
    .sort((a, b) => a.name?.localeCompare(b.name));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        Editar usuario
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Nombre completo"
            value={`${selectedItem?.name || ''} ${selectedItem?.lastName || ''}`}
            size="small"
            disabled
          />
          <TextField
            label="Correo electrónico"
            value={selectedItem?.email || ''}
            size="small"
            disabled
          />
          <TextField
            label="Tipo de documento"
            value={getDocumentTypeLabel(selectedItem?.documentType) || ''}
            size="small"
            disabled
          />
          <TextField
            label="Número de documento"
            value={selectedItem?.documentNumber || ''}
            size="small"
            disabled
          />
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={e => setActive(e.target.checked)}
              />
            }
            label="Activo"
          />
          <MultiSelect
            options={sortedRoles}
            value={selectedRoles}
            onChange={handleRolesChange}
            label="Roles"
            placeholder="Seleccionar roles..."
            error={!!errors.roles}
            helperText={errors.roles}
          />
          {selectedRoles.some(
            r => r.name === 'Coordinador Grupos Familiares',
          ) && (
            <Select
              label="Zona"
              value={selectedZone}
              onChange={handleZoneChange}
              size="small"
              error={!!errors.zone}
              helperText={errors.zone}
            >
              <MenuItem value="">
                <em>Seleccione una zona</em>
              </MenuItem>
              {[...zoneList]
                .sort((a, b) => a.name?.localeCompare(b.name))
                .map(z => (
                  <MenuItem key={z._id} value={z._id}>
                    {z.name?.toUpperCase()}
                  </MenuItem>
                ))}
            </Select>
          )}
          <Select
            label="Frente de trabajo"
            value={selectedWorkfront}
            onChange={e => setSelectedWorkfront(e.target.value)}
            size="small"
          >
            <MenuItem value="">
              <em>Sin frente</em>
            </MenuItem>
            {[...workfrontList]
              .sort((a, b) => a.name?.localeCompare(b.name))
              .map(w => (
                <MenuItem key={w._id} value={w._id}>
                  {w.name}
                </MenuItem>
              ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
