import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '../Card';
import styles from '../home/home.module.css';
import { iconsProvider } from '../../utils/iconsProvider';
import ModuleHeader from '../shared/ModuleHeader';

const MODULE_DESCRIPTIONS = {
  Aforo: 'Control de capacidad, registro de asistentes y gestión de eventos',
  'Administrar Usuarios': 'Gestión de usuarios del sistema',
  'Administrar Grupos Familiares':
    'Administración de grupos familiares de la iglesia',
};

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
  let title =
    selectedModuleRoutes.length > 0 && selectedModuleName
      ? selectedModuleName
      : 'Modulos';
  let description =
    selectedModuleRoutes.length > 0
      ? MODULE_DESCRIPTIONS[selectedModuleName] ||
        'Selecciona una funcionalidad para continuar.'
      : 'Selecciona un modulo para ver sus funcionalidades.';

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
      <ModuleHeader title={title} description={description} />

      <div className={styles.containerHome} style={{ padding: 0 }}>
        {cards}
      </div>
    </Box>
  );
}

export default HomeUser;
