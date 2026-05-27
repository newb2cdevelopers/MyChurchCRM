import React from 'react';
import Box from '@mui/material/Box';
import Card from '../Card';
import dataCards from '../dataCards';
import styles from '../home/home.module.css';
import ModuleHeader from '../shared/ModuleHeader';

export default function Aforo() {
  const cards = dataCards[0].options.map(card => {
    return (
      <div key={card.id}>
        <Card name={card.name} iconName={card.iconName} path={card.path} />
      </div>
    );
  });

  return (
    <Box>
      <ModuleHeader
        title="Aforo"
        description="Control de capacidad, registro de asistentes y gestión de eventos"
      />
      <div className={styles.containerHome}>{cards}</div>
    </Box>
  );
}
