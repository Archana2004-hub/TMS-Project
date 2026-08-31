import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';

import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ComplaintList from './components/complaints/ComplaintList';
import RaiseComplaint from './components/complaints/RaiseComplaint';
import ComplaintDetail from './components/complaints/ComplaintDetail';
import Departments from './components/master/Departments';
import Programmes from './components/master/Programmes';
import Blocks from './components/master/Blocks';
import Rooms from './components/master/Rooms';
import Roles from './components/master/Roles';
import Users from './components/master/Users';
import Reports from './components/reports/Reports';

const SA = ['SuperAdmin'];

const Wrap = ({children}) => <Layout>{children}</Layout>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<PrivateRoute><Wrap><Dashboard /></Wrap></PrivateRoute>} />
          <Route path="/complaints" element={<PrivateRoute><Wrap><ComplaintList /></Wrap></PrivateRoute>} />
          <Route path="/complaints/new" element={<PrivateRoute roles={['SuperAdmin','Staff']}><Wrap><RaiseComplaint /></Wrap></PrivateRoute>} />
          <Route path="/complaints/:id" element={<PrivateRoute><Wrap><ComplaintDetail /></Wrap></PrivateRoute>} />

          <Route path="/master/departments" element={<PrivateRoute roles={SA}><Wrap><Departments /></Wrap></PrivateRoute>} />
          <Route path="/master/programmes"  element={<PrivateRoute roles={SA}><Wrap><Programmes /></Wrap></PrivateRoute>} />
          <Route path="/master/blocks"      element={<PrivateRoute roles={SA}><Wrap><Blocks /></Wrap></PrivateRoute>} />
          <Route path="/master/rooms"       element={<PrivateRoute roles={SA}><Wrap><Rooms /></Wrap></PrivateRoute>} />
          <Route path="/master/roles"       element={<PrivateRoute roles={SA}><Wrap><Roles /></Wrap></PrivateRoute>} />
          <Route path="/master/users"       element={<PrivateRoute roles={SA}><Wrap><Users /></Wrap></PrivateRoute>} />
          <Route path="/reports"            element={<PrivateRoute roles={SA}><Wrap><Reports /></Wrap></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
