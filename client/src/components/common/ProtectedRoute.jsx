import React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useGetProfileQuery } from '../../store/api/authApi';
import { setCredentials, logout, setLoading } from '../../store/features/authSlice';
import { selectIsAuthenticated, selectIsLoading, selectCurrentUser } from '../../store/features/authSlice';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectCurrentUser);
  
  // Cookie geçerliliğini kontrol et (sadece authenticated user'lar için)
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    isSuccess: profileSuccess
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated, // Authenticated değilse skip et
  });

  useEffect(() => {
    if (profileLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }

    // Profile başarıyla alındı ve localStorage'daki user'dan farklıysa güncelle
    // ANCAK sadece gerçekten authenticated user'lar için
    if (profileSuccess && profileData?.user && isAuthenticated) {
      dispatch(setCredentials(profileData.user));
    }

    // Cookie geçersizse (401, 403 gibi), logout yap
    if (profileError && isAuthenticated) {
      console.log('🚨 Cookie expired or invalid, forcing logout...');
      
      // Immediate localStorage cleanup
      localStorage.removeItem('user');
      localStorage.removeItem('preferences');
      
      dispatch(logout());
    }
  }, [profileLoading, profileSuccess, profileData, profileError, isAuthenticated, dispatch]);

  // Loading durumu
  if (isLoading || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication kontrolü
  if (!isAuthenticated || !user) {
    // Kullanıcı giriş yapmamış, login sayfasına yönlendir
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Role kontrolü
  if (requiredRole && user.role !== requiredRole) {
    // Yetkisiz erişim, uygun sayfaya yönlendir
    if (user.role === USER_ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    } else if (user.role === USER_ROLES.STUDENT) {
      return <Navigate to={ROUTES.STUDENT.DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  // Her şey OK, component'i render et
  return children;
};

export default ProtectedRoute;