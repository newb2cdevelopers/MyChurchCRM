import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';
import AttendanceForm from './AttendanceForm';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return '—';
  }
}

const columns = [
  {
    id: 'date',
    label: 'Fecha',
    sortable: true,
    accessor: row => formatDate(row.date),
  },
  {
    id: 'service',
    label: 'Servicio',
    sortable: true,
    accessor: row => row.service || '—',
  },
  {
    id: 'teacher',
    label: 'Maestro que da la clase',
    sortable: true,
    accessor: row => {
      const teacher = row.teacherId;
      if (!teacher) return '—';
      return typeof teacher === 'object' && teacher.fullName
        ? teacher.fullName.toUpperCase()
        : '—';
    },
  },
  {
    id: 'lessonName',
    label: 'Clase enseñada',
    maxWidth: '200px',
    tooltip: true,
    accessor: row => row.lessonName || '—',
  },
  {
    id: 'studentCount',
    label: 'Asistentes',
    accessor: row => {
      const count = (row.studentsAttendance || []).filter(
        s => s.hasAttended,
      ).length;
      return `${count} de ${(row.studentsAttendance || []).length}`;
    },
  },
  {
    id: 'comments',
    label: 'Observaciones',
    maxWidth: '220px',
    tooltip: true,
    accessor: row => row.comments || '—',
  },
];

export default function LevelAttendance({ levelId }) {
  const user = useSelector(state => state.user);
  const canRegister = usePermission(
    '/sunday-school-levels',
    'register_attendance',
  );
  const [attendance, setAttendance] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const fetchAttendance = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/attendance/${levelId}`,
      headers,
    );
    if (data) setAttendance(data);
  }, [levelId, user.token]);

  useEffect(() => {
    if (levelId) fetchAttendance();
  }, [levelId, fetchAttendance]);

  const filteredData = useMemo(() => {
    if (!searchInput) return attendance;
    const q = searchInput.toLowerCase();
    return attendance.filter(
      a =>
        a.lessonName?.toLowerCase().includes(q) ||
        a.comments?.toLowerCase().includes(q),
    );
  }, [attendance, searchInput]);

  return (
    <Box>
      <DataTable
        columns={columns}
        data={filteredData}
        search={{
          value: searchInput,
          onChange: setSearchInput,
          placeholder: 'Buscar por clase u observaciones...',
        }}
        toolbarActions={
          canRegister && (
            <Button
              variant="contained"
              onClick={() => setFormOpen(true)}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Registrar asistencia
            </Button>
          )
        }
        emptyState="No hay asistencias registradas para este nivel"
      />
      <AttendanceForm
        open={formOpen}
        setOpen={setFormOpen}
        levelId={levelId}
        onSave={fetchAttendance}
      />
    </Box>
  );
}
