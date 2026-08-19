import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { format, isSunday, previousSunday } from 'date-fns';
import TextField from '../../shared/TextField';
import Select from '../../shared/Select';
import DateInput from '../../shared/DateInput';
import CheckboxList from '../../shared/CheckboxList';
import Alert from '../../shared/Alert';
import showToast from '../../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import { getColombiaToday } from '../../../utils/dateUtils';

// The attendance date is the immediately preceding Sunday: if today (in
// Colombia) is Sunday, use today; otherwise use the most recent Sunday.
function getLastSundayDate() {
  const today = getColombiaToday();
  const sunday = isSunday(today) ? today : previousSunday(today);
  return format(sunday, 'yyyy-MM-dd');
}

export default function AttendanceForm({ open, setOpen, levelId, onSave }) {
  const user = useSelector(state => state.user);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState('');
  const [date, setDate] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [missingClass, setMissingClass] = useState(false);

  useEffect(() => {
    if (!open || !levelId) return;

    const fetchData = async () => {
      const headers = getAuthHeaders(user.token);
      const attendanceDate = getLastSundayDate();
      setDate(attendanceDate);

      const [studentsRes] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/student?levelId=${levelId}&page=1&limit=99999`,
        headers,
      );

      const [levelRes] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/level/${levelId}`,
        headers,
      );

      if (studentsRes?.data) {
        setStudents(studentsRes.data);
        setSelectedStudents([]);
      }

      const levelTeachers = levelRes?.teachers || [];
      setTeachers(levelTeachers);
      setTeacherId(levelTeachers.length === 1 ? levelTeachers[0]._id : '');

      setComments('');
      setLessonName('');
      setMissingClass(false);
      setLoadingClass(true);

      const [classRes] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/class/forWeek?date=${attendanceDate}&levelId=${levelId}`,
        headers,
      );

      if (classRes?.lessonName) {
        setLessonName(classRes.lessonName);
        setMissingClass(false);
      } else {
        setLessonName('');
        setMissingClass(true);
      }
      setLoadingClass(false);
    };
    fetchData();
  }, [open, levelId, user.token]);

  const handleSave = async () => {
    if (missingClass) {
      showToast.warning(
        'Clase no disponible',
        'No se ha subido la clase para esta semana. Comuníquese con el coordinador.',
      );
      return;
    }

    if (!date || !lessonName) {
      showToast.warning(
        'Campos obligatorios',
        'Fecha y nombre de la clase son obligatorios',
      );
      return;
    }

    if (!teacherId) {
      showToast.warning(
        'Campos obligatorios',
        'Seleccione el maestro que registra la asistencia',
      );
      return;
    }

    const selectedIds = new Set(selectedStudents.map(s => s._id));
    const studentsAttendance = students.map(s => ({
      studentId: s._id,
      hasAttended: selectedIds.has(s._id),
    }));

    const payload = {
      levelId,
      date,
      lessonName,
      teacherId,
      comments,
      studentsAttendance,
    };

    setSaving(true);
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericPostService(
      `${B2C_BASE_URL}/sundaySchool/registerAttendance`,
      payload,
      headers,
    );
    setSaving(false);

    if (error || data?.isSuccessful === false) {
      showToast.error(
        'Error',
        data?.message || 'Error al registrar la asistencia',
      );
      return;
    }

    showToast.success(
      'Asistencia registrada',
      'La asistencia se ha registrado exitosamente',
    );
    setOpen(false);
    if (onSave) onSave();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Asistencia</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <DateInput
            label="Fecha"
            value={date}
            onChange={() => {}}
            disabled
            required
          />
          <TextField
            label="Clase enseñada"
            value={lessonName}
            onChange={() => {}}
            size="small"
            disabled
            required
          />
          {missingClass && (
            <Alert severity="warning" title="Clase no disponible">
              No se ha subido la clase para esta semana. Comuníquese con el
              coordinador.
            </Alert>
          )}
          <Select
            label="Maestro que dio la clase"
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
            size="small"
            required
          >
            <MenuItem value="">
              <em>Seleccione un maestro</em>
            </MenuItem>
            {teachers.map(teacher => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.fullName?.toUpperCase() || teacher._id}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Observaciones"
            value={comments}
            onChange={e => setComments(e.target.value)}
            size="small"
            multiline
            rows={2}
          />
          <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
            Asistentes
          </Typography>
          <CheckboxList
            options={students}
            value={selectedStudents}
            onChange={setSelectedStudents}
            getOptionLabel={option =>
              `${option.name || ''} ${option.lastName || ''}`.trim()
            }
            emptyLabel="No hay estudiantes registrados en este nivel"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || loadingClass || missingClass}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
