import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function ConfirmDialog({
  open,
  onClose,
  title = 'Confirmar',
  description = '¿Está seguro de que desea realizar esta acción?',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  confirmColor = 'error',
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px -12px rgba(19, 27, 46, 0.08)',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: 14 }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
