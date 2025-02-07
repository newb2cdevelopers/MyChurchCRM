import {
  Routes,
  Route
} from "react-router-dom";

import Home from "../components/home"
import Login from "../components/login"
import Register from "../components/register"
import Aforo from "../components/aforo/index"
import HomeUser from "../components/homeUser";
import { ProtectedRoute } from "./protectedRoute";
import FormAforo from '../components/aforo/new people/Form'
import EventsOptions from "../components/aforo/events";
import VerifyAsistents from "../components/aforo/events/components/VerifyAsistents";
import EventListView from '../components/aforo/events/components/index'
import MainOptionsScreen from "../components/home/MainOptionsScreen";
import ConfirmBooking from "../components/aforo/events/bookings/confirmBooking";
import Reservation from '../components/reservationEvents'
import ManageBooking from "../components/aforo/events/bookings/ManageBookings";
import BulkLoad from "../components/BulkLoad/BulkLoad";
import Consolidation from "../components/consolidation";
import ChurchMembersList from "../components/consolidation/components/ChurchMembersList";
import CvMember from "../components/consolidation/components/CVmember";
import RecoveryPasswordRequest from './../components/login/recoveryPasswordRequest';
import WorkfrontAssignment from "../components/workfrontAssignments/workfrontAssignment";
import FamilyGroupList from './../components/manageFamilyGroup/components/familyGroupList';

const RoutesCollection = (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/recoveryPassword" element={<RecoveryPasswordRequest/>} />
    <Route path="/main" element={<MainOptionsScreen />} />
    <Route path="/register" element={<Register />} />
    <Route path="/aforo" element={
      <ProtectedRoute>
        <Aforo />
      </ProtectedRoute>
    } />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <HomeUser />
        </ProtectedRoute>
      }
    />
    <Route path="/*" element={<Aforo />} />
    <Route path="/new-people" element={<FormAforo />} />
    <Route path="/events-option" element={<EventsOptions />} />
    <Route path="/verify-asistents"
      element={
        <ProtectedRoute>
          <VerifyAsistents />
        </ProtectedRoute>
      } />
    <Route path="/create-events"
      element={
        <ProtectedRoute>
          <EventListView />
        </ProtectedRoute>
      } />
        <Route path="/front-assignment"
      element={
        <ProtectedRoute>
          <WorkfrontAssignment />
        </ProtectedRoute>
      } />
    <Route path="/confirmarReserva" element={<ConfirmBooking />} />
    <Route path="/reservation" element={<Reservation />} />
    <Route path="/manageBookings" element={<ManageBooking />} />
    <Route path="/cargaMasiva" element={
      <ProtectedRoute>
        <BulkLoad />
      </ProtectedRoute>
    } />
    <Route path="/consolidation" element={
      <ProtectedRoute>
        <Consolidation />
      </ProtectedRoute>
    } />
    <Route path="/members" element={
      <ProtectedRoute>
        <ChurchMembersList />
      </ProtectedRoute>} />
    <Route path="/cv-member" element={<CvMember /> }/>
    <Route path="/AdministrarGruposamiliares" element={<FamilyGroupList />} />
  </Routes>
);

export default RoutesCollection;
