import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector } from 'react-redux';
import TextField from '../../shared/TextField';
import DateInput from '../../shared/DateInput';
import MultiSelect from '../../shared/MultiSelect';
import showToast from '../../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  genericPutService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';

export default function ClassForm({ open, setOpen, selectedItem, onSuccess }) {
  const isEditing = selectedItem !== null;
  const user = useSelector(state => state.user);

  const [levels, setLevels] = useState([]);
  const [saving, setSaving] = useState(false);

  const [lessonName, setLessonName] = useState('');
  const [date, setDate] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectAllLevels, setSelectAllLevels] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [errors, setErrors] = useState({});

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
    setLessonName(selectedItem?.lessonName || '');
    setDate(selectedItem?.date || '');
    setSelectedLevels(selectedItem?.levelIds || []);
    setSelectAllLevels(false);
    setPdfFile(null);
    setPdfName(selectedItem?.pdfUrl ? 'PDF actual cargado' : '');

    fetchLevels();
  }, [open, selectedItem, fetchLevels]);

  const handlePdfChange = event => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setPdfFile(null);
      setPdfName(isEditing ? 'PDF actual cargado' : '');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      showToast.error('Archivo inválido', 'El archivo debe ser un PDF');
      event.target.value = '';
      return;
    }

    setPdfFile(selectedFile);
    setPdfName(selectedFile.name);
    event.target.value = '';
  };

  const handleSelectAllLevels = event => {
    const checked = event.target.checked;
    setSelectAllLevels(checked);
    setSelectedLevels(checked ? levels : []);
    setErrors(prev => ({ ...prev, levels: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!lessonName.trim())
      errs.lessonName = 'El nombre de la clase es obligatorio';
    if (!date) errs.date = 'La fecha es obligatoria';
    if (selectedLevels.length === 0) {
      errs.levels = 'Seleccione al menos un nivel';
    }
    if (!isEditing && !pdfFile) {
      errs.pdf = 'El PDF de la clase es obligatorio';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = new FormData();
    payload.append('lessonName', lessonName.trim());
    payload.append('date', date);
    payload.append(
      'levelIds',
      JSON.stringify(selectedLevels.map(level => level._id || level)),
    );
    if (pdfFile) payload.append('pdf', pdfFile);

    setSaving(true);
    const service = isEditing ? genericPutService : genericPostService;
    const url = isEditing
      ? `${B2C_BASE_URL}/sundaySchool/class/${selectedItem._id}`
      : `${B2C_BASE_URL}/sundaySchool/class`;
    const [data, error] = await service(url, payload);
    setSaving(false);

    if (error || data?.isSuccessful === false) {
      showToast.error('Error', data?.message || 'Se ha presentado un error');
      return;
    }

    showToast.success(
      isEditing ? 'Clase actualizada' : 'Clase creada',
      isEditing
        ? 'La clase se ha actualizado correctamente'
        : 'La clase se ha creado correctamente',
    );
    onSuccess?.();
  };

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        {isEditing ? 'Editar Clase' : 'Subir Nueva Clase'}
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
            label="Nombre de la clase"
            value={lessonName}
            onChange={e => setLessonName(e.target.value)}
            error={!!errors.lessonName}
            helperText={errors.lessonName}
            size="small"
            required
          />
          <DateInput
            label="Fecha"
            value={date}
            onChange={setDate}
            error={!!errors.date}
            helperText={errors.date}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAllLevels}
                onChange={handleSelectAllLevels}
                disabled={levels.length === 0}
              />
            }
            label="Aplicar a todos los niveles"
          />
          <MultiSelect
            label="Niveles"
            options={levels
              .slice()
              .sort((a, b) => (a.name || '').localeCompare(b.name || ''))}
            value={selectedLevels}
            onChange={setSelectedLevels}
            getOptionLabel={option => option.name?.toUpperCase() || ''}
            placeholder="Buscar y seleccionar niveles"
            multiple
            disabled={selectAllLevels}
            error={!!errors.levels}
            helperText={errors.levels}
            required
          />
          <Box>
            <input
              id="sunday-school-class-pdf"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handlePdfChange}
            />
            <label htmlFor="sunday-school-class-pdf">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                sx={{ textTransform: 'none' }}
              >
                {isEditing ? 'Reemplazar PDF' : 'Seleccionar PDF'}
              </Button>
            </label>
            {pdfName && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1.5 }}
              >
                {pdfName}
              </Typography>
            )}
            {errors.pdf && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {errors.pdf}
              </Typography>
            )}
          </Box>
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
