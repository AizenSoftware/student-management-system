import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Loader2, GraduationCap, Shield, User } from 'lucide-react';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/features/authSlice';
import { USER_ROLES, ROUTES } from '../../utils/constants';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response.user));
      
      // Role'e göre yönlendirme
      if (response.user.role === USER_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    } catch (err) {
      setError('root', { 
        message: 'Giriş başarısız. E-posta ve şifrenizi kontrol edin.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h1>
          <p className="text-gray-600">
            Öğrenci Yönetim Sistemi'ne giriş yapın
          </p>
        </div>

        {/* Login Formu */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'E-posta adresi gereklidir',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Geçerli bir e-posta adresi girin'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="E-posta adresinizi girin"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'Şifre gereklidir',
                    minLength: {
                      value: 6,
                      message: 'Şifre en az 6 karakter olmalıdır'
                    }
                  })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Hata Mesajı */}
            {(errors.root || error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {errors.root?.message || error?.data?.message || 'Giriş başarısız. Lütfen tekrar deneyin.'}
                </p>
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>

          {/* Demo Hesapları */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">Demo Hesapları</p>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                <Shield className="w-5 h-5 text-blue-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Yönetici</p>
                  <p className="text-xs text-gray-600">admin@example.com / admin123</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                <User className="w-5 h-5 text-green-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Öğrenci</p>
                  <p className="text-xs text-gray-600">student@example.com / 123456</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 Öğrenci Yönetim Sistemi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;