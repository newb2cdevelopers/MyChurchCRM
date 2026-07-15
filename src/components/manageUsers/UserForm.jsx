import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import {
  genericGetService,
  genericPutService,
  getAuthHeaders,
} from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';
import MultiSelect from '../shared/MultiSelect';

export default function UserForm({ open, setOpen, selectedItem, onSuccess }) {
  const user = useSelector(state => state.user);

  const [active, setActive] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const headers = getAuthHeaders(user.token);
      genericGetService(`${B2C_BASE_URL}/role`, headers).then(([data]) => {
        if (data) setRolesList(data);
      });

      if (selectedItem) {
        setActive(selectedItem.active || false);
        setSelectedRoles(selectedItem.roles || []);
      } else {
        setActive(false);
        setSelectedRoles([]);
      }
    }
  }, [open, selectedItem, user.token]);

  const handleSave = async () => {
    setSaving(true);
    const headers = getAuthHeaders(user.token);
    const payload = {
      active,
      roles: selectedRoles.map(r => r._id),
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

  const handleClose = () => setOpen(false);

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
              {selectedItem?.name} {selectedItem?.lastName}
            </Box>
            <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
              {selectedItem?.email}
            </Box>
          </Box>
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
            onChange={setSelectedRoles}
            label="Roles"
            placeholder="Seleccionar roles..."
          />
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
