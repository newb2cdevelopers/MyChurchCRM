import EventListView from '../components/aforo/events/components';
import VerifyAsistents from '../components/aforo/events/components/VerifyAsistents';
import ConfirmBooking from '../components/aforo/events/bookings/confirmBooking';
import BulkLoad from '../components/BulkLoad/BulkLoad';
import ChurchMembersList from '../components/member/ChurchMembersList';
import WorkfrontAssignment from '../components/workfrontAssignments/workfrontAssignment';
import FamilyGroupList from '../components/manageFamilyGroup/components/familyGroupList';

const ROUTE_COMPONENTS = {
  '/create-events': EventListView,
  '/verify-asistents': VerifyAsistents,
  '/confirmarReserva': ConfirmBooking,
  '/cargaMasiva': BulkLoad,
  '/members': ChurchMembersList,
  '/front-assignment': WorkfrontAssignment,
  '/family-groups': FamilyGroupList,
};

export default ROUTE_COMPONENTS;
