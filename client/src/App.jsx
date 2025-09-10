import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminLessons from './pages/admin/AdminLessons';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMyLessons from './pages/student/StudentMyLessons';
import StudentLessons from './pages/student/StudentLessons';
import StudentProfile from './pages/student/StudentProfile';
import { USER_ROLES, ROUTES } from './utils/constants';
import { loadUserFromStorage } from './store/features/authSlice';

function App() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Uygulama başlatılırken localStorage'dan user'ı yükle ve tamamen bitirmesini bekle
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 App - Initializing auth...');
      
      // localStorage kontrolü
      const storedUser = localStorage.getItem('user');
      console.log('📦 App - Stored user:', storedUser);
      
      // Redux'a localStorage'dan user'ı yükle
      dispatch(loadUserFromStorage());
      
      // Kısa bir delay ile Redux'ın update olmasını bekle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ App - Auth initialized');
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  // Debug logging
  console.log('🔍 App - State:', { 
    user, 
    isAuthenticated, 
    isInitialized,
    userRole: user?.role 
  });

  // Eğer henüz initialize olmadıysa loading göster
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Uygulama başlatılıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path={ROUTES.ADMIN.DASHBOARD} 
          element={
            isAuthenticated && user?.role === USER_ROLES.ADMIN ? 
            <AdminDashboard /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.ADMIN.STUDENTS} 
          element={
            isAuthenticated && user?.role === USER_ROLES.ADMIN ? 
            <AdminStudents /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.ADMIN.LESSONS} 
          element={
            isAuthenticated && user?.role === USER_ROLES.ADMIN ? 
            <AdminLessons /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        {/* YENİ: Admin Enrollments Route */}
        <Route 
          path={ROUTES.ADMIN.ENROLLMENTS} 
          element={
            isAuthenticated && user?.role === USER_ROLES.ADMIN ? 
            <AdminEnrollments /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        {/* Student Routes */}
        <Route 
          path={ROUTES.STUDENT.DASHBOARD} 
          element={
            isAuthenticated && user?.role === USER_ROLES.STUDENT ? 
            <StudentDashboard /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.STUDENT.MY_LESSONS} 
          element={
            isAuthenticated && user?.role === USER_ROLES.STUDENT ? 
            <StudentMyLessons /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.STUDENT.LESSONS} 
          element={
            isAuthenticated && user?.role === USER_ROLES.STUDENT ? 
            <StudentLessons /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        <Route 
          path={ROUTES.STUDENT.PROFILE} 
          element={
            isAuthenticated && user?.role === USER_ROLES.STUDENT ? 
            <StudentProfile /> : 
            <Navigate to={ROUTES.LOGIN} />
          } 
        />
        
        {/* Default Routes */}
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