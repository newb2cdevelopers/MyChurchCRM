import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '../../customComponents/button';

/**
 * Shared modal that lists the students of an attendance record, marking who
 * attended and who did not. Receives a normalized list of
 * { fullName, hasAttended } entries.
 */
function AttendanceViewModal({
  open,
  onClose,
  title,
  subtitle,
  students = [],
}) {
  const attended = students.filter(s => s.hasAttended).length;
  const absent = students.length - attended;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent dividers>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {attended} asistieron
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {absent} no asistieron
          </Typography>
        </Box>
        {students.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay estudiantes registrados para esta clase.
          </Typography>
        ) : (
          <List dense disablePadding>
            {students.map((student, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {student.hasAttended ? (
                    <CheckCircleIcon
                      sx={{ color: 'primary.main', fontSize: 20 }}
                    />
                  ) : (
                    <CancelIcon
                      sx={{ color: 'text.secondary', fontSize: 20 }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText primary={student.fullName || '—'} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceViewModal;
