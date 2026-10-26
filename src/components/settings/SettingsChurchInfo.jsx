import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '../shared/TextField';
import { genericGetService } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

export default function SettingsChurchInfo() {
  const user = useSelector(state => state.user);

  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChurch = useCallback(async () => {
    if (!user.selectedChurchId) return;

    setLoading(true);
    const [data] = await genericGetService(
      `${B2C_BASE_URL}/church/${user.selectedChurchId}`,
    );
    setLoading(false);

    if (data) {
      setChurch(data);
    }
  }, [user.selectedChurchId]);

  useEffect(() => {
    fetchChurch();
  }, [fetchChurch]);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Información de la iglesia
          </Typography>
          <Box sx={{ maxWidth: 420 }}>
            <TextField
              label="Nombre de la iglesia"
              value={loading ? 'Cargando...' : church?.name || ''}
              disabled
              fullWidth
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
