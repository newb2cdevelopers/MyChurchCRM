import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DateInput from '../DateInput';

const GeneralInfoStep = forwardRef(function GeneralInfoStep(
  { initialData },
  ref,
) {
  const user = useSelector(state => state.user);
  const [workFrontList, setWorkFrontList] = useState([]);
  const [values, setValues] = useState(() => {
    if (initialData) {
      return {
        documentNumber: initialData.documentNumber || '',
        documentType: initialData.documentType || '',
        fullName: initialData.fullName || '',
        address: initialData.address || '',
        housingType: initialData.housingType || '',
        landLine: initialData.landLine || '',
        mobilePhone: initialData.mobilePhone || '',
        email: initialData.email || '',
        birthDate: initialData.birthDate || '',
        maritalStatus: initialData.maritalStatus || '',
        educationalLevel: initialData.educationalLevel || '',
        occupation: initialData.occupation || '',
        conversionyear: initialData.conversionyear || '',
        yearInChurch: initialData.yearInChurch || '',
        isBaptised: initialData.isBaptised || false,
        workfront: initialData.workfront?._id || initialData.workfront || '',
        comments: initialData.comments || '',
      };
    }
    return {
      documentNumber: '',
      documentType: '',
      fullName: '',
      address: '',
      housingType: '',
      landLine: '',
      mobilePhone: '',
      email: '',
      birthDate: '',
      maritalStatus: '',
      educationalLevel: '',
      occupation: '',
      conversionyear: '',
      yearInChurch: '',
      isBaptised: false,
      workfront: '',
      comments: '',
    };
  });
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    genericGetService(
      `${B2C_BASE_URL}/workfront/workfrontsByChurch/${user.selectedChurchId}`,
      getAuthHeaders(user.token),
    ).then(data => {
      if (data[0]) setWorkFrontList(data[0]);
    });
  }, [user.selectedChurchId, user.token]);

  const handleChange = e => {
    setDirty(true);
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (
      (name === 'documentNumber' ||
        name === 'conversionyear' ||
        name === 'yearInChurch' ||
        name === 'landLine' ||
        name === 'mobilePhone') &&
      type !== 'checkbox'
    ) {
      val = value.replace(/\D/g, '');
    }
    setValues(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = date => {
    setDirty(true);
    setValues(prev => ({ ...prev, birthDate: date }));
    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.documentNumber.trim())
      newErrors.documentNumber = 'El número de documento es obligatorio';
    if (!values.documentType)
      newErrors.documentType = 'El tipo de documento es obligatorio';
    if (!values.fullName.trim())
      newErrors.fullName = 'El nombre completo es obligatorio';
    if (!values.address.trim())
      newErrors.address = 'La dirección es obligatoria';
    if (!values.mobilePhone.trim())
      newErrors.mobilePhone = 'El número de celular es obligatorio';
    if (!values.workfront)
      newErrors.workfront = 'El frente de trabajo es obligatorio';
    if (values.email.trim() && !/\S+@\S+\.\S+/.test(values.email))
      newErrors.email = 'El correo no es válido';
    if (!values.birthDate)
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    getData: () => {
      if (!validate()) return null;
      return {
        ...values,
        conversionyear: values.conversionyear
          ? Number(values.conversionyear)
          : 0,
        yearInChurch: values.yearInChurch ? Number(values.yearInChurch) : 0,
        churchId: user.selectedChurchId,
        documentNumber: values.documentNumber.trim(),
        email: values.email.trim(),
      };
    },
    isDirty: () => dirty,
  }));

  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 520 }, mx: 'auto' }}>
      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Typography
          sx={{ fontSize: 13, lineHeight: '18px', color: 'text.secondary' }}
        >
          Complete los datos personales del nuevo miembro
        </Typography>

        <FormControl size="small" error={!!errors.documentType} required>
          <InputLabel>Tipo de documento</InputLabel>
          <Select
            name="documentType"
            value={values.documentType}
            label="Tipo de documento"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Seleccione una opción</em>
            </MenuItem>
            <MenuItem value="CC">Cédula</MenuItem>
            <MenuItem value="TI">Tarjeta de identidad</MenuItem>
            <MenuItem value="RC">Registro civil</MenuItem>
            <MenuItem value="CE">Cédula de extranjería</MenuItem>
          </Select>
          {errors.documentType && (
            <FormHelperText>{errors.documentType}</FormHelperText>
          )}
        </FormControl>

        <TextField
          size="small"
          label="Número de documento"
          name="documentNumber"
          value={values.documentNumber}
          onChange={handleChange}
          error={!!errors.documentNumber}
          helperText={errors.documentNumber}
          required
        />

        <TextField
          size="small"
          label="Nombre completo"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          required
        />

        <TextField
          size="small"
          label="Dirección"
          name="address"
          value={values.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          required
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
            label="Teléfono fijo"
            name="landLine"
            value={values.landLine}
            onChange={handleChange}
          />
          <TextField
            size="small"
            label="Celular"
            name="mobilePhone"
            value={values.mobilePhone}
            onChange={handleChange}
            error={!!errors.mobilePhone}
            helperText={errors.mobilePhone}
            required
          />
        </Box>

        <TextField
          size="small"
          label="Correo electrónico"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <DateInput
          label="Fecha de nacimiento"
          value={values.birthDate}
          onChange={handleDateChange}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          required
        />

        <FormControl size="small">
          <InputLabel>Estado civil</InputLabel>
          <Select
            name="maritalStatus"
            value={values.maritalStatus}
            label="Estado civil"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Seleccione una opción</em>
            </MenuItem>
            <MenuItem value="Soltero(a)">Soltero(a)</MenuItem>
            <MenuItem value="Casado(a)">Casado(a)</MenuItem>
            <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
            <MenuItem value="Viudo(a)">Viudo(a)</MenuItem>
            <MenuItem value="Unión libre">Unión libre</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Nivel educativo</InputLabel>
            <Select
              name="educationalLevel"
              value={values.educationalLevel}
              label="Nivel educativo"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Seleccione una opción</em>
              </MenuItem>
              <MenuItem value="Primaria">Primaria</MenuItem>
              <MenuItem value="Secundaria">Secundaria</MenuItem>
              <MenuItem value="Técnico">Técnico</MenuItem>
              <MenuItem value="Tecnólogo">Tecnólogo</MenuItem>
              <MenuItem value="Universitario">Universitario</MenuItem>
              <MenuItem value="Postgrado">Postgrado</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Ocupación</InputLabel>
            <Select
              name="occupation"
              value={values.occupation}
              label="Ocupación"
              onChange={handleChange}
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Año de conversión"
            name="conversionyear"
            type="text"
            value={values.conversionyear}
            onChange={handleChange}
            placeholder="Ej: 2020"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Años en la iglesia"
            name="yearInChurch"
            type="text"
            value={values.yearInChurch}
            onChange={handleChange}
            placeholder="0"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            sx={{ flex: 1 }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              name="isBaptised"
              checked={values.isBaptised}
              onChange={handleChange}
            />
          }
          label="¿Es bautizado?"
        />

        <FormControl size="small" error={!!errors.workfront}>
          <InputLabel>Frente o área de trabajo *</InputLabel>
          <Select
            name="workfront"
            value={values.workfront}
            label="Frente o área de trabajo *"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Seleccione una opción</em>
            </MenuItem>
            {workFrontList.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {errors.workfront && (
            <FormHelperText>{errors.workfront}</FormHelperText>
          )}
        </FormControl>

        <TextField
          size="small"
          label="Observaciones"
          name="comments"
          value={values.comments}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Box>
    </Box>
  );
});

export default GeneralInfoStep;
