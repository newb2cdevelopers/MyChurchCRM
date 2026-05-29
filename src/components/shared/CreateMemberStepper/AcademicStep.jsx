import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConfirmDialog from '../ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  genericPutService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';

const emptyForm = {
  name: '',
  AcademicInstitutionName: '',
  isFinished: false,
  comments: '',
};

const cellEllipsis = {
  fontSize: 13,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 160,
};

const AcademicStep = forwardRef(function AcademicStep(
  { initialItems, memberId, token, onSaved },
  ref,
) {
  const [items, setItems] = useState(() => initialItems || []);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    index: null,
  });
  const [saving, setSaving] = useState(false);

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El título es obligatorio';
    if (!form.AcademicInstitutionName.trim())
      errs.AcademicInstitutionName = 'La institución es obligatoria';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      console.log('[AcademicStep] validateForm FAILED');
      return;
    }

    console.log('[AcademicStep] validateForm OK');

    const itemToSave = { ...form };
    Object.keys(itemToSave).forEach(key => {
      if (
        itemToSave[key] === '' ||
        itemToSave[key] === null ||
        itemToSave[key] === undefined
      ) {
        delete itemToSave[key];
      }
    });

    console.log(
      '[AcademicStep] memberId:',
      memberId,
      'isEditing:',
      Boolean(memberId),
    );

    if (memberId) {
      setSaving(true);
      const headers = getAuthHeaders(token);
      console.log(
        '[AcademicStep] calling PUT with payload:',
        JSON.stringify(itemToSave),
      );
      const [result, error] = await genericPutService(
        `${B2C_BASE_URL}/member/updateAcademicStudy/${memberId}`,
        itemToSave,
        headers,
      );
      setSaving(false);

      console.log(
        '[AcademicStep] PUT response result:',
        result,
        'error:',
        error,
      );

      if (error || !result?.isSuccessful) {
        console.log('[AcademicStep] PUT failed — alert shown');
        alert('Error al guardar el estudio');
        return;
      }

      onSaved?.();

      if (result.data?.additionalAcademicStudies) {
        const saved = result.data.additionalAcademicStudies.find(
          s =>
            s.name === form.name &&
            s.AcademicInstitutionName === form.AcademicInstitutionName,
        );
        if (saved?._id) {
          itemToSave._id = saved._id;
        }
      }
    }

    console.log(
      '[AcademicStep] updating local state, editIndex:',
      editIndex,
      'itemToSave:',
      JSON.stringify(itemToSave),
    );

    if (editIndex !== null) {
      setItems(prev =>
        prev.map((item, i) => (i === editIndex ? itemToSave : item)),
      );
    } else {
      setItems(prev => [...prev, itemToSave]);
    }
    setForm({ ...emptyForm });
    setEditIndex(null);
    setShowForm(false);
    setFormErrors({});
    console.log('[AcademicStep] handleAdd complete');
  };

  const handleEdit = index => {
    setForm({ ...items[index] });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteRequest = index => {
    setDeleteConfirm({ open: true, index });
  };

  const handleDeleteConfirm = () => {
    const idx = deleteConfirm.index;
    setItems(prev => prev.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setForm({ ...emptyForm });
      setEditIndex(null);
      setShowForm(false);
    }
    setDeleteConfirm({ open: false, index: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, index: null });
  };

  const handleCancel = () => {
    setForm({ ...emptyForm });
    setEditIndex(null);
    setShowForm(false);
    setFormErrors({});
  };

  useImperativeHandle(ref, () => ({
    getData: () =>
      items.map(item => {
        const clean = { ...item };
        Object.keys(clean).forEach(key => {
          if (
            clean[key] === '' ||
            clean[key] === null ||
            clean[key] === undefined
          ) {
            delete clean[key];
          }
        });
        return clean;
      }),
  }));

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Typography
        sx={{
          fontSize: 13,
          lineHeight: '18px',
          color: 'text.secondary',
          mb: 2,
        }}
      >
        Registre estudios y formaciones académicas del miembro
      </Typography>

      {items.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            mb: 2,
            boxShadow: 'none',
            border: '1px solid #f1f1f1',
            borderRadius: 2,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  Título
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  Institución
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  Finalizado
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                  align="right"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={cellEllipsis}>{item.name}</TableCell>
                  <TableCell sx={cellEllipsis}>
                    {item.AcademicInstitutionName}
                  </TableCell>
                  <TableCell sx={cellEllipsis}>
                    {item.isFinished ? 'Sí' : 'No'}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton size="small" onClick={() => handleEdit(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRequest(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!showForm && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          sx={{ mb: 2 }}
        >
          Agregar estudio
        </Button>
      )}

      {showForm && (
        <Box
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: '#faf8ff',
            display: 'grid',
            gap: 2,
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {editIndex !== null ? 'Editar estudio' : 'Nuevo estudio'}
          </Typography>

          <TextField
            size="small"
            label="Título"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />

          <TextField
            size="small"
            label="Institución"
            name="AcademicInstitutionName"
            value={form.AcademicInstitutionName}
            onChange={handleFormChange}
            error={!!formErrors.AcademicInstitutionName}
            helperText={formErrors.AcademicInstitutionName}
            required
          />

          <FormControlLabel
            control={
              <Switch
                name="isFinished"
                checked={form.isFinished}
                onChange={handleFormChange}
              />
            }
            label="¿Finalizado?"
          />

          <TextField
            size="small"
            label="Observaciones"
            name="comments"
            value={form.comments}
            onChange={handleFormChange}
            multiline
            rows={2}
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="text" onClick={handleCancel} size="small">
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleAdd}
              size="small"
              disabled={saving}
            >
              {editIndex !== null ? 'Guardar cambios' : 'Agregar'}
            </Button>
          </Box>
        </Box>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={handleDeleteCancel}
        title="Eliminar estudio"
        description="¿Está seguro de que desea eliminar este estudio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
});

export default AcademicStep;
