import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import { useSelector } from 'react-redux';
import Button from '../../../customComponents/button';
import CheckboxList from '../../shared/CheckboxList';
import ConfirmDialog from '../../shared/ConfirmDialog';
import showToast from '../../../customComponents/toast/showToast';
import {
  genericGetService,
  genericPostService,
  getAuthHeaders,
} from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import { getAgeFromBirthDate } from '../../../utils/dateUtils';

function studentLabel(student) {
  const name = `${student.name || ''} ${student.lastName || ''}`.trim();
  const age = getAgeFromBirthDate(student.birthDate);
  const ageText = age !== null ? ` · ${age} años` : '';
  return `${name}${ageText}`.toUpperCase();
}

export default function PromotionModal({ open, onClose, levelId, onSuccess }) {
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchPreview = useCallback(async () => {
    if (!levelId) return;
    setLoading(true);
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/level/${levelId}/promotion-preview`,
      headers,
    );
    if (!error && data) {
      setPreview(data);
      setSelected([]);
    } else {
      showToast.error(
        'Error',
        error?.message || 'No se pudo cargar la información de promoción',
      );
    }
    setLoading(false);
  }, [levelId, user.token]);

  useEffect(() => {
    if (open) fetchPreview();
  }, [open, fetchPreview]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!selected.length) return;
    setSubmitting(true);
    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericPostService(
      `${B2C_BASE_URL}/sundaySchool/level/${levelId}/promote`,
      { studentIds: selected.map(s => s._id) },
      headers,
    );
    setSubmitting(false);
    setConfirmOpen(false);

    if (!error && data?.isSuccessful) {
      showToast.success('Promoción exitosa', data.message);
      onClose();
      onSuccess?.();
    } else {
      showToast.error(
        'Error',
        data?.message || error?.message || 'No se pudo completar la promoción',
      );
    }
  };

  const nextLevel = preview?.nextLevel;
  const isLastLevel = preview?.isLastLevel;
  const students = preview?.students || [];

  const confirmText = isLastLevel
    ? `Graduar (${selected.length})`
    : `Promover (${selected.length})`;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(19, 27, 46, 0.08)',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>
          Promoción de estudiantes
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                  mb: 2,
                }}
              >
                <Chip
                  label={preview?.level?.name?.toUpperCase() || '—'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <ArrowForwardIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
                {isLastLevel ? (
                  <Chip
                    label="GRADUACIÓN (FIN DE ESCUELA DOMINICAL)"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    label={nextLevel?.name?.toUpperCase() || '—'}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>

              {isLastLevel && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(94, 57, 224, 0.06)',
                  }}
                >
                  <SchoolIcon
                    sx={{ fontSize: 18, color: 'primary.main', mt: 0.25 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Este es el último nivel. Los estudiantes seleccionados serán
                    graduados y dejarán de pertenecer a Escuela Dominical.
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selecciona los estudiantes a{' '}
                {isLastLevel ? 'graduar' : 'promover'}:
              </Typography>

              <CheckboxList
                options={students}
                value={selected}
                onChange={setSelected}
                getOptionLabel={studentLabel}
                emptyLabel="No hay estudiantes en este nivel"
                selectAllLabel="Seleccionar todos"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => setConfirmOpen(true)}
            disabled={loading || !selected.length || submitting}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={isLastLevel ? 'Confirmar graduación' : 'Confirmar promoción'}
        description={
          isLastLevel
            ? `Se graduarán ${selected.length} estudiante(s). Esta acción los retira de Escuela Dominical. ¿Desea continuar?`
            : `Se promoverán ${selected.length} estudiante(s) al nivel ${nextLevel?.name}. ¿Desea continuar?`
        }
        confirmText={confirmText}
        cancelText="Cancelar"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </>
  );
}
