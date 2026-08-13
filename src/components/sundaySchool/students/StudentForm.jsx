import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import TextField from '../../shared/TextField';
import Select from '../../shared/Select';
import DateInput from '../../shared/DateInput';
import showToast from '../../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  genericPutService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL, DOCUMENT_TYPES } from '../../../constants';
import { getAgeFromBirthDate } from '../../../utils/dateUtils';

export default function StudentForm({
  open,
  setOpen,
  selectedItem,
  onSuccess,
}) {
  const isEditing = selectedItem !== null;
  const user = useSelector(state => state.user);

  const [levels, setLevels] = useState([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState('TI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [observations, setObservations] = useState('');
  const [levelId, setLevelId] = useState('');
  const [errors, setErrors] = useState({});
  const [birthDateTouched, setBirthDateTouched] = useState(false);

  const fetchLevels = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/level`,
      headers,
    );
    if (data) setLevels(data);
  }, [user.token]);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setName(selectedItem?.name || '');
    setLastName(selectedItem?.lastName || '');
    setDocumentType(selectedItem?.documentType || 'TI');
    setDocumentNumber(selectedItem?.documentNumber || '');
    setBirthDate(selectedItem?.birthDate || '');
    setBirthDateTouched(false);
    setFatherName(selectedItem?.fatherName || '');
    setMotherName(selectedItem?.motherName || '');
    setEmergencyContactName(selectedItem?.emergencyContactName || '');
    setEmergencyContactPhone(selectedItem?.emergencyContactPhone || '');
    setGuardianName(selectedItem?.guardianName || '');
    setObservations(selectedItem?.observations || '');
    setLevelId(selectedItem?.levelId?._id || selectedItem?.levelId || '');

    fetchLevels();
  }, [open, selectedItem, fetchLevels]);

  // Suggest a level based on the birth date. It only runs when the user
  // actually edits the birth date, so editing an existing student keeps the
  // level that was already assigned.
  useEffect(() => {
    if (!birthDateTouched || !birthDate || levels.length === 0) return;

    const age = getAgeFromBirthDate(birthDate);
    if (age === null) return;

    const suggestedLevel = levels.find(
      level => age >= level.minAge && age <= level.maxAge,
    );

    setLevelId(suggestedLevel?._id || '');
  }, [birthDate, birthDateTouched, levels]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (!lastName.trim()) errs.lastName = 'El apellido es obligatorio';
    if (!documentType) errs.documentType = 'Seleccione un tipo de documento';
    if (!documentNumber.trim()) {
      errs.documentNumber = 'El número de documento es obligatorio';
    } else if (!/^\d+$/.test(documentNumber)) {
      errs.documentNumber = 'Solo se permiten números';
    }
    if (!birthDate) errs.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!emergencyContactName.trim()) {
      errs.emergencyContactName = 'El contacto de emergencia es obligatorio';
    }
    if (!emergencyContactPhone.trim()) {
      errs.emergencyContactPhone = 'El teléfono de emergencia es obligatorio';
    } else if (!/^\d+$/.test(emergencyContactPhone)) {
      errs.emergencyContactPhone = 'Solo se permiten números';
    }
    if (!levelId) errs.levelId = 'Seleccione un nivel';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      lastName: lastName.trim(),
      documentType,
      documentNumber,
      birthDate,
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      guardianName: guardianName.trim() || undefined,
      observations: observations.trim() || undefined,
      levelId,
    };

    setSaving(true);
    const service = isEditing ? genericPutService : genericPostService;
    const url = isEditing
      ? `${B2C_BASE_URL}/sundaySchool/student/${selectedItem._id}`
      : `${B2C_BASE_URL}/sundaySchool/student`;
    const [data, error] = await service(url, payload);
    setSaving(false);

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Se ha presentado un error');
      return;
    }

    showToast.success(
      isEditing ? 'Estudiante actualizado' : 'Estudiante registrado',
      isEditing
        ? 'El estudiante se ha actualizado correctamente'
        : 'El estudiante se ha registrado correctamente',
    );
    onSuccess?.();
  };

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        {isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante'}
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
          <TextField
            label="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
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
            onChange={e => setDocumentNumber(e.target.value.replace(/\D/g, ''))}
            error={!!errors.documentNumber}
            helperText={errors.documentNumber}
            size="small"
            required
            inputProps={{ inputMode: 'numeric' }}
          />
          <DateInput
            label="Fecha de nacimiento"
            value={birthDate}
            onChange={value => {
              setBirthDate(value);
              setBirthDateTouched(true);
            }}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            required
          />
          <Select
            label="Nivel"
            value={levelId}
            onChange={e => setLevelId(e.target.value)}
            error={!!errors.levelId}
            helperText={
              errors.levelId ||
              (birthDateTouched && birthDate && levels.length > 0 && !levelId
                ? 'No existe un nivel para la edad de este estudiante'
                : '')
            }
            size="small"
            required
          >
            <MenuItem value="">
              <em>Seleccione un nivel</em>
            </MenuItem>
            {levels
              .slice()
              .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
              .map(level => (
                <MenuItem key={level._id} value={level._id}>
                  {`${level.name?.toUpperCase()} (${level.minAge} - ${level.maxAge} años)`}
                </MenuItem>
              ))}
          </Select>
          <TextField
            label="Nombre del padre"
            value={fatherName}
            onChange={e => setFatherName(e.target.value)}
            size="small"
          />
          <TextField
            label="Nombre de la madre"
            value={motherName}
            onChange={e => setMotherName(e.target.value)}
            size="small"
          />
          <TextField
            label="Contacto de emergencia"
            value={emergencyContactName}
            onChange={e => setEmergencyContactName(e.target.value)}
            error={!!errors.emergencyContactName}
            helperText={errors.emergencyContactName}
            size="small"
            required
          />
          <TextField
            label="Teléfono de emergencia"
            value={emergencyContactPhone}
            onChange={e =>
              setEmergencyContactPhone(e.target.value.replace(/\D/g, ''))
            }
            error={!!errors.emergencyContactPhone}
            helperText={errors.emergencyContactPhone}
            size="small"
            required
            inputProps={{ inputMode: 'numeric' }}
          />
          <TextField
            label="Acudiente"
            value={guardianName}
            onChange={e => setGuardianName(e.target.value)}
            size="small"
          />
          <TextField
            label="Observaciones"
            value={observations}
            onChange={e => setObservations(e.target.value)}
            size="small"
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || levels.length === 0}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
