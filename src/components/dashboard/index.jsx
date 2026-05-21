import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

function Dashboard() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Inicio
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Estamos preparando los indicadores y accesos rapidos.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme => alpha(theme.palette.divider, 0.3),
          bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Datos en construccion
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona un modulo en el menu para ver sus funcionalidades.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
