import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '../Card';
import styles from '../home/home.module.css';
import { iconsProvider } from '../../utils/iconsProvider';

function HomeUser() {
  const user = useSelector(state => state.user);
  const { selectedModuleRoutes, selectedModuleName } = useSelector(
    state => state.navigation,
  );

  if (!user.roles || user.roles.length === 0) {
    return (
      <div className={styles.containerHome}>
        {
          'El usuario no tiene accesos asignados, por favor comuníquese con el administrador'
        }
      </div>
    );
  }

  let cards = [];

  if (selectedModuleRoutes.length > 0) {
    cards = selectedModuleRoutes.map(card => (
      <div key={card._id}>
        <Card
          name={card.name}
          accesses={null}
          iconName={iconsProvider[card.icon] || card.icon}
          path={card.route}
        />
      </div>
    ));
  } else {
    cards = user.roles.map(card => (
      <div key={card.accesses[0].module._id}>
        <Card
          name={card.module}
          accesses={card.accesses}
          iconName={
            iconsProvider[card.accesses[0].module.icon] ||
            card.accesses[0].module.icon
          }
          path={'/modules'}
        />
      </div>
    ));
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        {selectedModuleRoutes.length > 0 && selectedModuleName
          ? selectedModuleName
          : 'Modulos'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {selectedModuleRoutes.length > 0
          ? 'Selecciona una funcionalidad para continuar.'
          : 'Selecciona un modulo para ver sus funcionalidades.'}
      </Typography>

      <div className={styles.containerHome} style={{ padding: 0 }}>
        {cards}
      </div>
    </Box>
  );
}

export default HomeUser;
