import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventIcon from '@mui/icons-material/Event';
import PostAddIcon from '@mui/icons-material/PostAdd';

const dataCards = [
  {
    id: 0,
    name: "Aforo",
    iconName: <GroupsIcon sx={{ fontSize: 70 }}/>, 
    path: "/aforo",
    isGuestRoute: false,
    options: [
      {
        id: 0,
        name: "Personas nuevas",
        iconName: <PersonAddAlt1Icon sx={{ fontSize: 70 }}/>,
        path: "/new-people",
      },
      {
        id: 1,
        name: "Eventos",
        iconName: <CalendarMonthIcon sx={{ fontSize: 70 }}/>,
        path: "/events-option",
        options: [
          {
            id: 0,
            name: "Verificar Asistencia",
            iconName: <HowToRegIcon sx={{ fontSize: 70 }}/>,
            path: "/verify-asistents",
          },
          {
            id: 1,
            name: "Crear evento",
            iconName: <EventIcon sx={{ fontSize: 70 }}/>,
            path: "/create-events",
          },
        ],
      },
      {
        id: 2,
        name: "Carga Masiva Asistentes",
        iconName: <PostAddIcon sx={{ fontSize: 70 }}/>,
        path: "/cargaMasiva",
      },
      {
        id: 4,
        name: "Personas nuevas",
        iconName: <PersonAddAlt1Icon sx={{ fontSize: 70 }}/>,
        path: "/consolidation"
      },
      {
        id: 4,
        name: "Members",
        iconName: <PersonAddAlt1Icon sx={{ fontSize: 70 }}/>,
        path: "/members"
      }

    ],
  }
];

export default dataCards;
