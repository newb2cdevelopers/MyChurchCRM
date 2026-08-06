import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';

function SundaySchool() {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 3 }}>
        <SchoolIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Módulo en construcción
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí se mostrará la tabla de estudiantes de escuela dominical.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SundaySchool;
