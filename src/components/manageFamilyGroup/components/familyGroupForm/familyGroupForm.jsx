import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '../../../shared/Select';
import MenuItem from '@mui/material/MenuItem';
import DateInput from '../../../shared/DateInput';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import {
  genericGetService,
  genericPostService,
  genericPutService,
  getAuthHeaders,
} from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';

const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const TIMES = [
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const STATUSES = ['Activo', 'Suspendido', 'Cancelado'];

export default function FamilyGroupForm({ open, setOpen, selectedItem }) {
  const isEditing = selectedItem !== null;
  const user = useSelector(state => state.user);

  const [membersList, setMembersList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [localityList, setLocalityList] = useState([]);
  const [allLocalityList, setAllLocalityList] = useState([]);
  const [neighborhoodList, setNeighborhoodList] = useState([]);
  const [allNeighborhoodList, setAllNeighborhoodList] = useState([]);

  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [zoneBind, setZoneBind] = useState('');
  const [locality, setLocality] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [leader, setLeader] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getMembers = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    return await genericGetService(
      `${B2C_BASE_URL}/member?churchId=${user.selectedChurchId}&limit=99999`,
      headers,
    );
  }, [user.token, user.selectedChurchId]);

  const getZones = useCallback(async () => {
    return await genericGetService(`${B2C_BASE_URL}/zone`);
  }, []);

  const getLocalities = useCallback(async () => {
    return await genericGetService(`${B2C_BASE_URL}/locality`);
  }, []);

  const getNeighborhoods = useCallback(async () => {
    return await genericGetService(`${B2C_BASE_URL}/neighborhood`);
  }, []);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setCode(selectedItem?.code || '');
    setAddress(selectedItem?.address || '');
    setStartDate(selectedItem?.startDate || '');
    setNeighborhood(selectedItem?.neighborhood?._id || '');
    setLeader(selectedItem?.leader?._id || '');
    setDay(selectedItem?.day || '');
    setTime(selectedItem?.time || '');
    setStatus(selectedItem?.status || '');

    const fetchAll = async () => {
      const [membersRes, zonesRes, localitiesRes, neighborhoodsRes] =
        await Promise.all([
          getMembers(),
          getZones(),
          getLocalities(),
          getNeighborhoods(),
        ]);

      if (membersRes[0]?.data) setMembersList(membersRes[0].data);
      if (zonesRes[0]) setZoneList(zonesRes[0]);
      if (localitiesRes[0]) {
        setAllLocalityList(localitiesRes[0]);
        if (selectedItem) {
          const zone = localitiesRes[0].find(
            l => l._id === selectedItem.neighborhood?.locality,
          );
          if (zone) {
            setZoneBind(zone.zone?._id || '');
            const filtered = localitiesRes[0].filter(
              l => l.zone?._id === zone.zone?._id,
            );
            setLocalityList(filtered);
          }
        } else {
          setLocalityList(localitiesRes[0]);
        }
      }
      if (neighborhoodsRes[0]) {
        setAllNeighborhoodList(neighborhoodsRes[0]);
        if (selectedItem) {
          const filtered = neighborhoodsRes[0].filter(
            n => n.locality?._id === selectedItem.neighborhood?.locality,
          );
          setNeighborhoodList(filtered);
        } else {
          setNeighborhoodList(neighborhoodsRes[0]);
        }
      }
    };
    fetchAll();
  }, [
    open,
    selectedItem,
    getMembers,
    getZones,
    getLocalities,
    getNeighborhoods,
  ]);

  const validate = () => {
    const errs = {};
    if (!code) errs.code = 'El código es obligatorio';
    if (!address) errs.address = 'La dirección es obligatoria';
    if (!startDate) errs.startDate = 'La fecha de inicio es obligatoria';
    if (!leader) errs.leader = 'Seleccione un líder';
    if (!neighborhood) errs.neighborhood = 'Seleccione un barrio';
    if (!day) errs.day = 'Seleccione un día';
    if (!time) errs.time = 'Seleccione una hora';
    if (!status) errs.status = 'Seleccione un estado';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      code,
      address,
      startDate,
      leader,
      neighborhood,
      time,
      day,
      status,
      created_by: '62b5eb1ab5f08f33e6de2c28',
      _id: isEditing ? selectedItem._id : null,
    };

    setLoading(true);
    const service = isEditing ? genericPutService : genericPostService;
    const [data, error] = await service(`${B2C_BASE_URL}/familyGroup`, payload);
    setLoading(false);

    if (error || data?.isSuccessful === false) {
      alert(data?.message || 'Se ha presentado un error');
      return;
    }
    alert('Guardado exitoso');
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  const handleChangeZone = e => {
    const zoneId = e.target.value;
    setZoneBind(zoneId);
    const filtered = allLocalityList.filter(l => l.zone?._id === zoneId);
    setLocalityList(filtered);
    setLocality('');
    setNeighborhood('');
    const firstLocalityFiltered = allNeighborhoodList.filter(
      n => n.locality?._id === filtered[0]?._id,
    );
    setNeighborhoodList(firstLocalityFiltered);
  };

  const handleChangeLocality = e => {
    const locId = e.target.value;
    setLocality(locId);
    const filtered = allNeighborhoodList.filter(n => n.locality?._id === locId);
    setNeighborhoodList(filtered);
    setNeighborhood('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        {isEditing ? 'Editar Grupo Familiar' : 'Nuevo Grupo Familiar'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Código"
            value={code}
            onChange={e => setCode(e.target.value)}
            error={!!errors.code}
            helperText={errors.code}
            size="small"
            required
            sx={{ maxWidth: 120 }}
          />
          <TextField
            label="Dirección"
            value={address}
            onChange={e => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            size="small"
            required
          />
          <DateInput
            label="Fecha de inicio"
            value={startDate}
            onChange={setStartDate}
            error={!!errors.startDate}
            helperText={errors.startDate}
            required
          />
          <Select
            label="Zona"
            value={zoneBind}
            onChange={handleChangeZone}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione una zona</em>
            </MenuItem>
            {zoneList
              .sort((a, b) => a.name?.localeCompare(b.name))
              .map(z => (
                <MenuItem key={z._id} value={z._id}>
                  {z.name?.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
          <Select
            label="Comuna / Localidad"
            value={locality}
            onChange={handleChangeLocality}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione una localidad</em>
            </MenuItem>
            {localityList
              .sort((a, b) => a.name?.localeCompare(b.name))
              .map(l => (
                <MenuItem key={l._id} value={l._id}>
                  {l.name?.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
          <Select
            label="Barrio"
            value={neighborhood}
            onChange={e => setNeighborhood(e.target.value)}
            error={!!errors.neighborhood}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione un barrio</em>
            </MenuItem>
            {neighborhoodList
              .sort((a, b) => a.name?.localeCompare(b.name))
              .map(n => (
                <MenuItem key={n._id} value={n._id}>
                  {n.name?.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
          <Select
            label="Líder Principal"
            value={leader}
            onChange={e => setLeader(e.target.value)}
            error={!!errors.leader}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione un líder</em>
            </MenuItem>
            {membersList
              .sort((a, b) => a.fullName?.localeCompare(b.fullName))
              .map(m => (
                <MenuItem key={m._id} value={m._id}>
                  {m.fullName?.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
          <Select
            label="Día"
            value={day}
            onChange={e => setDay(e.target.value)}
            error={!!errors.day}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione un día</em>
            </MenuItem>
            {DAYS.map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Hora"
            value={time}
            onChange={e => setTime(e.target.value)}
            error={!!errors.time}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione una hora</em>
            </MenuItem>
            {TIMES.map(t => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Estado"
            value={status}
            onChange={e => setStatus(e.target.value)}
            error={!!errors.status}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccione un estado</em>
            </MenuItem>
            {STATUSES.map(s => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
