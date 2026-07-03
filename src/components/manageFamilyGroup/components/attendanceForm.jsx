import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import DateInput from '../../shared/DateInput';
import { useSelector } from 'react-redux';
import {
  genericGetService,
  genericPostService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';

export default function AttendanceForm({
  open,
  setOpen,
  familyGroupId,
  onSave,
}) {
  const user = useSelector(state => state.user);

  const [members, setMembers] = useState([]);
  const [date, setDate] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [comments, setComments] = useState('');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      const headers = getAuthHeaders(user.token);
      const data = await genericGetService(
        `${B2C_BASE_URL}/familyGroup`,
        headers,
      );
      if (data[0] && data[0].length > 0) {
        const group = data[0].find(g => g._id === familyGroupId);
        if (group?.members) {
          setMembers(group.members);
          const map = {};
          group.members.forEach(m => {
            map[m._id || m.documentNumber] = true;
          });
          setAttendanceMap(map);
        }
      }
      setDate('');
      setLessonName('');
      setComments('');
    };
    fetchData();
  }, [open, familyGroupId, user.token]);

  const toggleAttendance = memberId => {
    setAttendanceMap(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleSave = async () => {
    if (!date || !lessonName) {
      alert('Fecha y nombre de la clase son obligatorios');
      return;
    }

    const membersAttendance = members.map(m => ({
      familyGroupmember: m._id,
      hasAttended: !!attendanceMap[m._id || m.documentNumber],
    }));

    const payload = {
      date,
      lessonName,
      comments,
      membersAttendance,
      familyGroup: familyGroupId,
    };

    setSaving(true);
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericPostService(
      `${B2C_BASE_URL}/familyGroup/registerFamilyGroupAttendance`,
      payload,
      headers,
    );
    setSaving(false);

    if (error || data?.isSuccessful === false) {
      alert(data?.message || 'Error al registrar asistencia');
      return;
    }

    alert('Asistencia registrada exitosamente');
    setOpen(false);
    if (onSave) onSave();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Asistencia</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <DateInput label="Fecha" value={date} onChange={setDate} required />
          <TextField
            label="Clase enseñada"
            value={lessonName}
            onChange={e => setLessonName(e.target.value)}
            size="small"
            required
          />
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
          {members.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No hay integrantes registrados en este grupo
            </Typography>
          )}
          {members.map(m => (
            <FormControlLabel
              key={m._id || m.documentNumber}
              control={
                <Checkbox
                  checked={!!attendanceMap[m._id || m.documentNumber]}
                  onChange={() => toggleAttendance(m._id || m.documentNumber)}
                  size="small"
                />
              }
              label={m.name}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
