import { Routes, Route } from 'react-router-dom';

import Landing from '../components/landing';
import Login from '../components/login';
import Register from '../components/register';
import Dashboard from '../components/dashboard';
import { ProtectedRoute } from './protectedRoute';
import FormAforo from '../components/aforo/new people/Form';
import EventsOptions from '../components/aforo/events';
import MainOptionsScreen from '../components/home/MainOptionsScreen';
import PublicEvents from '../components/home/PublicEvents';
import NotFound from '../components/notFound';
import Reservation from '../components/reservationEvents';
import ManageBooking from '../components/aforo/events/bookings/ManageBookings';
import CvMember from '../components/member/CVmember';
import RecoveryPasswordRequest from './../components/login/recoveryPasswordRequest';
import FamilyGroupDetail from '../components/manageFamilyGroup/components/familyGroupDetail';
import DirectoryCompanies from '../components/directoryCompanies';
import CompanyForm from '../components/directoryCompanies/CompanyForm';
import CompanyDetail from '../components/directoryCompanies/CompanyDetail';
import InternalCompanies from '../components/directoryCompanies/InternalCompanies';
import DynamicModulePage from '../components/dynamicModulePage';
import AuthAwareLayout from '../components/layout/AuthAwareLayout';

const RoutesCollection = (
  <Routes>
    {/* Standalone routes — nunca tienen sidebar */}
    <Route exact path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/recoveryPassword" element={<RecoveryPasswordRequest />} />
    <Route path="/main" element={<MainOptionsScreen />} />
    <Route path="/public-events" element={<PublicEvents />} />

    {/* Layout-aware routes — sidebar solo si hay token */}
    <Route element={<AuthAwareLayout />}>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/:slug"
        element={
          <ProtectedRoute>
            <DynamicModulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/:slug/:functionalitySlug"
        element={
          <ProtectedRoute>
            <DynamicModulePage />
          </ProtectedRoute>
        }
      />
      <Route path="/new-people" element={<FormAforo />} />
      <Route path="/events-option" element={<EventsOptions />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/manage-bookings" element={<ManageBooking />} />
      <Route path="/cv-member" element={<CvMember />} />
      <Route
        path="/manage-family-groups/:id"
        element={
          <ProtectedRoute>
            <FamilyGroupDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/company-directory" element={<DirectoryCompanies />} />
      <Route
        path="/company-directory/internal"
        element={
          <ProtectedRoute>
            <InternalCompanies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-directory/new"
        element={
          <ProtectedRoute>
            <CompanyForm />
          </ProtectedRoute>
        }
      />
      <Route path="/company-directory/:id" element={<CompanyDetail />} />
      <Route
        path="/company-directory/:id/edit"
        element={
          <ProtectedRoute>
            <CompanyForm />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* 404 — standalone, fuera del layout */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesCollection;
