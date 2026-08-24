import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import TextField from '../../shared/TextField';
import MultiSelect from '../../shared/MultiSelect';
import showToast from '../../../customComponents/toast/showToast';
import { useLevels } from '../../../hooks/useLevels';
import {
  genericGetService,
  genericPostService,
  genericPutService,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';

export default function LevelForm({ open, setOpen, selectedItem, onSuccess }) {
  const isEditing = selectedItem !== null;
  const user = useSelector(state => state.user);
  const { levels } = useLevels();

  const [membersList, setMembersList] = useState([]);
  const [assignedTeacherIds, setAssignedTeacherIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});

  const resolveSundaySchoolModuleId = useCallback(() => {
    const accesses = (user.roles || []).flatMap(role => role.accesses || []);
    const sundaySchoolAccess = accesses.find(
      access => access?.module?.route === 'sunday-school',
    );
    return sundaySchoolAccess?.module?._id || null;
  }, [user.roles]);

  const fetchMembers = useCallback(async () => {
    const moduleId = resolveSundaySchoolModuleId();

    if (!moduleId) {
      setMembersList([]);
      showToast.error(
        'Error',
        'No se pudo identificar el módulo de Escuela Dominical para filtrar maestros.',
      );
      return;
    }

    const [workfronts, workfrontError] = await genericGetService(
      `${B2C_BASE_URL}/workfront/by-module?moduleId=${encodeURIComponent(moduleId)}`,
    );

    if (workfrontError) {
      setMembersList([]);
      showToast.error(
        'Error',
        workfrontError?.message ||
          'No se pudieron consultar los frentes del módulo actual.',
      );
      return;
    }

    const moduleWorkfrontId = workfronts?.[0]?._id;

    if (!moduleWorkfrontId) {
      setMembersList([]);
      return;
    }

    const [membersData, membersError] = await genericGetService(
      `${B2C_BASE_URL}/member?limit=99999&workfrontId=${encodeURIComponent(moduleWorkfrontId)}`,
    );

    if (membersError) {
      setMembersList([]);
      showToast.error(
        'Error',
        membersError?.message || 'No se pudo consultar el listado de maestros.',
      );
      return;
    }

    setMembersList(membersData?.data || []);
  }, [resolveSundaySchoolModuleId]);

  // Builds the set of member IDs that are already teachers of another level,
  // so they can be excluded from the teacher options. The level being edited
  // is ignored so its current teachers remain selectable.
  const fetchAssignedTeachers = useCallback(async () => {
    // Use cached levels from Redux instead of making a new request
    const assigned = new Set();

    (levels || []).forEach(level => {
      if (isEditing && level._id === selectedItem?._id) return;
      (level.teachers || []).forEach(teacher => {
        if (teacher?._id) assigned.add(String(teacher._id));
      });
    });

    setAssignedTeacherIds(assigned);
  }, [isEditing, selectedItem, levels]);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setName(selectedItem?.name || '');
    setMinAge(selectedItem?.minAge ?? '');
    setMaxAge(selectedItem?.maxAge ?? '');
    setTeachers(selectedItem?.teachers || []);

    // Parallelize the two fetches
    Promise.all([fetchMembers(), fetchAssignedTeachers()]);
  }, [open, selectedItem, fetchMembers, fetchAssignedTeachers]);

  // Members that are not already teachers of another level.
  const availableMembers = useMemo(
    () =>
      membersList.filter(member => !assignedTeacherIds.has(String(member._id))),
    [membersList, assignedTeacherIds],
  );

  const hiddenTeachersCount = membersList.length - availableMembers.length;

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
            options={availableMembers
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
            helperText={
              hiddenTeachersCount > 0
                ? 'Algunos miembros no aparecen porque ya son maestros de otro nivel. Para asignarlos aquí, primero elimínelos de su nivel actual.'
                : 'Puede buscar y seleccionar uno o varios maestros'
            }
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
