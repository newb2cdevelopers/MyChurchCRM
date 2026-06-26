import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

function DataTable({
  columns,
  data,
  search,
  pagination,
  sort,
  toolbarActions,
  isLoading,
  emptyState,
  onRowClick,
  rowActions,
}) {
  const handleSort = columnId => {
    if (!sort) return;
    const isAsc = sort.columnId === columnId && sort.direction === 'asc';
    sort.onSortChange(columnId, isAsc ? 'desc' : 'asc');
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: '1px solid #f1f1f1',
        boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
      }}
    >
      {(search || toolbarActions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: { xs: 1.5, md: 2 },
            pb: 2,
            flexWrap: 'wrap',
          }}
        >
          {search && (
            <Tooltip title={search.placeholder || 'Buscar…'}>
              <TextField
                placeholder={search.placeholder || 'Buscar…'}
                value={search.value}
                onChange={e => search.onChange(e.target.value)}
                size="small"
                hiddenLabel
                sx={{
                  minWidth: { xs: 0, sm: 300 },
                  flex: { xs: '1 1 100%', sm: '0 1 auto' },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    display: 'none',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: 'text.secondary', fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  sx: {
                    py: '7px',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            </Tooltip>
          )}
          {toolbarActions && (
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              {toolbarActions}
            </Box>
          )}
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    ...(col.width ? { width: col.width } : {}),
                  }}
                >
                  {sort && col.sortable ? (
                    <TableSortLabel
                      active={sort.columnId === col.id}
                      direction={
                        sort.columnId === col.id ? sort.direction : 'asc'
                      }
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map(col => (
                    <TableCell key={col.id}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  align="center"
                  sx={{ py: 6 }}
                >
                  {emptyState ? (
                    <Box>
                      {emptyState.icon && (
                        <Box sx={{ mb: 1, color: 'text.secondary' }}>
                          {emptyState.icon}
                        </Box>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {emptyState.message}
                      </Typography>
                      {emptyState.action && (
                        <Box sx={{ mt: 2 }}>{emptyState.action}</Box>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin resultados
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={row._id || row.id || index}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {columns.map(col => (
                    <TableCell key={col.id} align={col.align || 'left'}>
                      {col.accessor(row)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell align="right" onClick={e => e.stopPropagation()}>
                      {rowActions({ row })}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          onPageChange={(e, newPage) => pagination.onPageChange(newPage)}
          rowsPerPage={pagination.pageSize}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      )}
    </Box>
  );
}

export default DataTable;
