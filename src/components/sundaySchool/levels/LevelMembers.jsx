import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { format, parse, isValid } from 'date-fns';
import {
  genericGetService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import DataTable from '../../shared/DataTable';

function formatDate(value) {
  if (!value) return '—';
  let raw = value;
  if (typeof raw === 'string' && raw.includes('T')) raw = raw.split('T')[0];
  const d = parse(raw, 'yyyy-MM-dd', new Date());
  return isValid(d) ? format(d, 'dd/MM/yyyy') : raw;
}

const columns = [
  {
    id: 'name',
    label: 'Nombre completo',
    accessor: row => `${row.name || ''} ${row.lastName || ''}`.trim() || '—',
  },
  {
    id: 'documentNumber',
    label: 'Identificación',
    accessor: row => row.documentNumber || '—',
  },
  {
    id: 'birthDate',
    label: 'Fecha de nacimiento',
    accessor: row => formatDate(row.birthDate),
  },
  {
    id: 'emergencyContactName',
    label: 'Contacto de emergencia',
    accessor: row => row.emergencyContactName || '—',
  },
  {
    id: 'emergencyContactPhone',
    label: 'Teléfono emergencia',
    accessor: row => row.emergencyContactPhone || '—',
  },
];

export default function LevelMembers({ levelId }) {
  const user = useSelector(state => state.user);
  const [students, setStudents] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const fetchStudents = useCallback(
    async (pageNum = 0, search = '') => {
      setLoading(true);
      const headers = getAuthHeaders(user.token);
      const params = new URLSearchParams({
        levelId,
        page: String(pageNum + 1),
        limit: String(pageSize),
      });
      if (search) params.set('search', search);
      const [data] = await genericGetService(
        `${B2C_BASE_URL}/sundaySchool/student?${params}`,
        headers,
      );
      if (data) {
        setStudents(data.data || []);
        setTotalRecords(data.metadata?.totalRecords || 0);
      }
      setLoading(false);
    },
    [levelId, user.token],
  );

  useEffect(() => {
    if (levelId) fetchStudents(0, '');
  }, [levelId, fetchStudents]);

  const handleSearchChange = useCallback(
    value => {
      setSearchInput(value);
      setPage(0);
      fetchStudents(0, value);
    },
    [fetchStudents],
  );

  const handlePageChange = useCallback(
    newPage => {
      setPage(newPage);
      fetchStudents(newPage, searchInput);
    },
    [fetchStudents, searchInput],
  );

  const filteredData = useMemo(() => {
    if (!searchInput) return students;
    const q = searchInput.toLowerCase();
    return students.filter(s =>
      `${s.name} ${s.lastName} ${s.documentNumber}`.toLowerCase().includes(q),
    );
  }, [students, searchInput]);

  return (
    <Box>
      <DataTable
        columns={columns}
        data={filteredData}
        search={{
          value: searchInput,
          onChange: handleSearchChange,
          placeholder: 'Buscar por nombre o documento...',
        }}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          onPageChange: handlePageChange,
        }}
        emptyState="Este nivel no tiene estudiantes asignados"
        isLoading={loading}
      />
    </Box>
  );
}
