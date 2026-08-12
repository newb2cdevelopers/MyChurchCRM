import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '../../shared/TextField';
import MultiSelect from '../../shared/MultiSelect';
import showToast from '../../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  genericPutService,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';

export default function LevelForm({ open, setOpen, selectedItem, onSuccess }) {
  const isEditing = selectedItem !== null;

  const [membersList, setMembersList] = useState([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchMembers = useCallback(async () => {
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/member?limit=99999&ignoreWorkfront=true`,
    );
    if (data?.data) setMembersList(data.data);
  }, []);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setName(selectedItem?.name || '');
    setMinAge(selectedItem?.minAge ?? '');
    setMaxAge(selectedItem?.maxAge ?? '');
    setTeachers(selectedItem?.teachers || []);

    fetchMembers();
  }, [open, selectedItem, fetchMembers]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (minAge === '' || minAge === null) {
      errs.minAge = 'La edad mínima es obligatoria';
    } else if (Number(minAge) < 0) {
      errs.minAge = 'La edad mínima no puede ser negativa';
    }
    if (maxAge === '' || maxAge === null) {
      errs.maxAge = 'La edad máxima es obligatoria';
    } else if (Number(maxAge) < 0) {
      errs.maxAge = 'La edad máxima no puede ser negativa';
    }
    if (minAge !== '' && maxAge !== '' && Number(minAge) > Number(maxAge)) {
      errs.maxAge = 'La edad máxima no puede ser menor que la mínima';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      minAge: Number(minAge),
      maxAge: Number(maxAge),
      teachers: teachers.map(t => t._id || t),
    };

    setSaving(true);
    const service = isEditing ? genericPutService : genericPostService;
    const url = isEditing
      ? `${B2C_BASE_URL}/sundaySchool/level/${selectedItem._id}`
      : `${B2C_BASE_URL}/sundaySchool/level`;
    const [data, error] = await service(url, payload);
    setSaving(false);

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Se ha presentado un error');
      return;
    }

    showToast.success(
      isEditing ? 'Nivel actualizado' : 'Nivel creado',
      isEditing
        ? 'El nivel se ha actualizado correctamente'
        : 'El nivel se ha creado correctamente',
    );
    onSuccess?.();
  };

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        {isEditing ? 'Editar Nivel' : 'Nuevo Nivel'}
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
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            size="small"
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Edad mínima"
              value={minAge}
              onChange={e => setMinAge(e.target.value.replace(/\D/g, ''))}
              error={!!errors.minAge}
              helperText={errors.minAge}
              size="small"
              required
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
              sx={{ maxWidth: 160 }}
            />
            <TextField
              label="Edad máxima"
              value={maxAge}
              onChange={e => setMaxAge(e.target.value.replace(/\D/g, ''))}
              error={!!errors.maxAge}
              helperText={errors.maxAge}
              size="small"
              required
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
              sx={{ maxWidth: 160 }}
            />
          </Box>
          <MultiSelect
            label="Maestros"
            options={membersList
              .slice()
              .sort((a, b) =>
                (a.fullName || '').localeCompare(b.fullName || ''),
              )}
            value={teachers}
            onChange={setTeachers}
            getOptionLabel={option =>
              option.fullName?.toUpperCase() || option._id || ''
            }
            placeholder="Buscar y seleccionar maestros"
            helperText="Puede buscar y seleccionar uno o varios maestros"
            multiple
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
