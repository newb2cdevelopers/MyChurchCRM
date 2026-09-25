import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';
import AttendanceViewModal from '../../shared/AttendanceViewModal';
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  const fetchAttendance = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    const params = new URLSearchParams({
      page: String(page + 1),
      limit: String(pageSize),
    });
    if (searchInput) params.set('search', searchInput);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/attendance/${levelId}?${params}`,
      headers,
    );
    if (data) {
      setAttendance(data.data || []);
      setTotalRecords(data.metadata?.totalRecords || 0);
    }
  }, [levelId, user.token, page, searchInput]);

  useEffect(() => {
    if (levelId) fetchAttendance();
  }, [levelId, fetchAttendance]);

  const handleSearchChange = value => {
    setSearchInput(value);
    setPage(0);
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const rowActions = ({ row }) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title="Ver asistentes">
        <IconButton size="small" onClick={() => setViewRow(row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const viewStudents = (viewRow?.studentsAttendance || []).map(sa => ({
    fullName:
      sa.studentId && typeof sa.studentId === 'object'
        ? `${sa.studentId.name || ''} ${sa.studentId.lastName || ''}`.trim()
        : '—',
    hasAttended: sa.hasAttended,
  }));

  return (
    <Box>
      <DataTable
        columns={columns}
        data={attendance}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por clase u observaciones...',
        }}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: handlePageChange,
        }}
        rowActions={rowActions}
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
      <AttendanceViewModal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Asistentes de la clase"
        subtitle={
          viewRow
            ? `${formatDate(viewRow.date)} · ${viewRow.service || ''} · ${
                viewRow.lessonName || ''
              }`
            : undefined
        }
        students={viewStudents}
      />
    </Box>
  );
}
