import EventListView from '../components/aforo/events/components';
import VerifyAsistents from '../components/aforo/events/components/VerifyAsistents';
import ConfirmBooking from '../components/aforo/events/bookings/confirmBooking';
import BulkLoad from '../components/BulkLoad/BulkLoad';
import ChurchMembersList from '../components/member/ChurchMembersList';
import WorkfrontAssignment from '../components/workfrontAssignments/workfrontAssignment';
import FamilyGroupList from '../components/manageFamilyGroup/components/familyGroupList';
import ManageUsers from '../components/manageUsers';
import StudentList from '../components/sundaySchool/students/StudentList';
import LevelList from '../components/sundaySchool/levels/LevelList';
import ClassList from '../components/sundaySchool/classes/ClassList';

const ROUTE_COMPONENTS = {
  '/create-events': EventListView,
  '/verify-asistents': VerifyAsistents,
  '/confirmarReserva': ConfirmBooking,
  '/cargaMasiva': BulkLoad,
  '/members': ChurchMembersList,
  '/front-assignment': WorkfrontAssignment,
  '/family-groups': FamilyGroupList,
  '/manage-users': ManageUsers,
  '/sunday-school-students': StudentList,
  '/sunday-school-levels': LevelList,
  '/sunday-school-classes': ClassList,
};

export default ROUTE_COMPONENTS;
