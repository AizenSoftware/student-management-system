import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import { USER_ROLES, ROUTES } from './utils/constants';

function App() {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="App">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
        <Route 
          path={ROUTES.ADMIN.DASHBOARD} 
          element={
            isAuthenticated && user?.role === USER_ROLES.ADMIN ? 
            <AdminDashboard /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.STUDENT.DASHBOARD} 
          element={
            isAuthenticated && user?.role === USER_ROLES.STUDENT ? 
            <StudentDashboard /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              (user?.role === USER_ROLES.ADMIN ? 
                <Navigate to={ROUTES.ADMIN.DASHBOARD} /> : 
                <Navigate to={ROUTES.STUDENT.DASHBOARD} />
              ) : 
              <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;