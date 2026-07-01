import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConfirmDialog from '../ConfirmDialog';
import DateInput from '../DateInput';
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
  documentNumber: '',
  address: '',
  mobilePhone: '',
  email: '',
  birthDate: '',
  occupation: '',
  kinship: '',
  comments: '',
};

const cellEllipsis = {
  fontSize: 13,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const FamilyStep = forwardRef(function FamilyStep(
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
    const { name, value, type } = e.target;
    let val = type === 'checkbox' ? value : value;
    if (name === 'documentNumber' || name === 'mobilePhone') {
      val = value.replace(/\D/g, '');
    }
    setForm(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = date => {
    setForm(prev => ({ ...prev, birthDate: date }));
    if (formErrors.birthDate) {
      setFormErrors(prev => ({ ...prev, birthDate: undefined }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!form.documentNumber.trim())
      errs.documentNumber = 'La identificación es obligatoria';
    if (!form.kinship) errs.kinship = 'El parentesco es obligatorio';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

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

    if (memberId) {
      setSaving(true);
      const headers = getAuthHeaders(token);
      const [result, error] = await genericPutService(
        `${B2C_BASE_URL}/member/updateRelativeInfo/${memberId}`,
        itemToSave,
        headers,
      );
      setSaving(false);

      if (error || !result?.isSuccessful) {
        alert('Error al guardar el familiar');
        return;
      }

      onSaved?.();

      if (result.data?.relatives) {
        const saved = result.data.relatives.find(
          r => r.documentNumber === form.documentNumber,
        );
        if (saved?._id) {
          itemToSave._id = saved._id;
        }
      }
    }

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
    <Box sx={{ maxWidth: { xs: '100%', md: 560 }, mx: 'auto' }}>
      <Typography
        sx={{
          fontSize: 13,
          lineHeight: '18px',
          color: 'text.secondary',
          mb: 2,
        }}
      >
        Gestione la información familiar del miembro
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
                  Nombre
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  Identificación
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}
                >
                  Parentesco
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
                  <TableCell sx={cellEllipsis}>{item.documentNumber}</TableCell>
                  <TableCell sx={cellEllipsis}>{item.kinship}</TableCell>
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
          Agregar familiar
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
            {editIndex !== null ? 'Editar familiar' : 'Nuevo familiar'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            <TextField
              size="small"
              label="Identificación"
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleFormChange}
              error={!!formErrors.documentNumber}
              helperText={formErrors.documentNumber}
              required
            />
          </Box>

          <TextField
            size="small"
            label="Dirección"
            name="address"
            value={form.address}
            onChange={handleFormChange}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              label="Celular"
              name="mobilePhone"
              value={form.mobilePhone}
              onChange={handleFormChange}
            />
            <TextField
              size="small"
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <DateInput
              label="Fecha de nacimiento"
              value={form.birthDate}
              onChange={handleDateChange}
            />
            <FormControl size="small">
              <InputLabel>Ocupación</InputLabel>
              <Select
                name="occupation"
                value={form.occupation}
                label="Ocupación"
                onChange={handleFormChange}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                <MenuItem value="Estudiante">Estudiante</MenuItem>
                <MenuItem value="Independiente">Independiente</MenuItem>
                <MenuItem value="Ama de casa">Ama de casa</MenuItem>
                <MenuItem value="Empleado">Empleado</MenuItem>
                <MenuItem value="Pensionado">Pensionado</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl size="small" error={!!formErrors.kinship}>
            <InputLabel>Parentesco *</InputLabel>
            <Select
              name="kinship"
              value={form.kinship}
              label="Parentesco *"
              onChange={handleFormChange}
            >
              <MenuItem value="">
                <em>Seleccione una opción</em>
              </MenuItem>
              <MenuItem value="Cónyuge">Cónyuge</MenuItem>
              <MenuItem value="Hijo/a">Hijo/a</MenuItem>
              <MenuItem value="Sobrino/a">Sobrino/a</MenuItem>
              <MenuItem value="Primo/a">Primo/a</MenuItem>
              <MenuItem value="Padre">Padre</MenuItem>
              <MenuItem value="Madre">Madre</MenuItem>
              <MenuItem value="Abuelo/a">Abuelo/a</MenuItem>
              <MenuItem value="Hermano/a">Hermano/a</MenuItem>
            </Select>
            {formErrors.kinship && (
              <FormHelperText>{formErrors.kinship}</FormHelperText>
            )}
          </FormControl>

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
        title="Eliminar familiar"
        description="¿Está seguro de que desea eliminar este familiar? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
});

export default FamilyStep;
