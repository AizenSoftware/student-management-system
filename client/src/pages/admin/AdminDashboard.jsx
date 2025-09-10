import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Users, 
  BookOpen, 
  UserCheck, 
  Settings, 
  Bell,
  BarChart3,
  Calendar,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { logout } from '../../store/features/authSlice';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const stats = [
    { title: 'Toplam Öğrenci', value: '0', change: '+0%', icon: Users, color: 'blue' },
    { title: 'Aktif Dersler', value: '0', change: '+0%', icon: BookOpen, color: 'green' },
    { title: 'Kayıtlı Öğrenci', value: '0', change: '+0%', icon: UserCheck, color: 'purple' },
    { title: 'Doluluk Oranı', value: '0%', change: '+0%', icon: TrendingUp, color: 'orange' }
  ];

  const quickActions = [
    { 
      title: 'Öğrenci Yönetimi', 
      description: 'Öğrencileri görüntüle, ekle, düzenle ve sil', 
      icon: Users, 
      color: 'blue',
      route: ROUTES.ADMIN.STUDENTS
    },
    { 
      title: 'Ders Yönetimi', 
      description: 'Dersleri yönet ve yeni ders tanımları oluştur', 
      icon: BookOpen, 
      color: 'green',
      route: ROUTES.ADMIN.LESSONS
    },
    { 
      title: 'Kayıt İşlemleri', 
      description: 'Öğrenci-ders eşleştirmelerini yönet', 
      icon: UserCheck, 
      color: 'purple',
      route: ROUTES.ADMIN.ENROLLMENTS
    },
  ];

  const handleQuickAction = (route) => {
    if (route && route !== '#') {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Yönetici Paneli</h1>
                <p className="text-sm text-gray-600">Öğrenci Yönetim Sistemi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Hoş geldiniz, {user?.firstName}! 👋
                </h2>
              </div>
              <div className="hidden md:block">
                <Calendar className="w-16 h-16 text-blue-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                  onClick={() => handleQuickAction(action.route)}
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <div className="mt-4">
                    <span className={`text-sm font-medium text-${action.color}-600 hover:text-${action.color}-700`}>
                      İşleme Git →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;