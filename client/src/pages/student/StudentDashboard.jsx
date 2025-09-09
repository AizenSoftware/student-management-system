import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  Users, 
  Calendar,
  Bell,
  User,
  GraduationCap,
  Clock,
  Search,
  BookOpenCheck,
  UserPlus,
  UserMinus,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { logout } from '../../store/features/authSlice';
import { ROUTES } from '../../utils/constants';

const StudentDashboard = () => {
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

  // API'den gelecek veriler için placeholder - gerçek verilerle değiştirilecek
  const stats = [
    { 
      title: 'Kayıtlı Derslerim', 
      value: '0', 
      icon: BookOpen, 
      color: 'blue'
    },
    { 
      title: 'Mevcut Dersler', 
      value: '0', 
      icon: BookOpenCheck, 
      color: 'green'
    },
    { 
      title: 'Bu Dönem', 
      value: '2024-2025', 
      icon: Calendar, 
      color: 'purple'
    },
    { 
      title: 'Öğrenci No', 
      value: user?.id?.slice(-6) || '------', 
      icon: GraduationCap, 
      color: 'orange'
    }
  ];

  const quickActions = [
    { 
      title: 'Ders Ara & Kayıt Ol', 
      description: 'Mevcut dersleri görüntüle ve kayıt ol', 
      icon: Search, 
      color: 'blue',
      route: '/student/lessons'
    },
    { 
      title: 'Kayıtlı Derslerim', 
      description: 'Aldığın dersleri görüntüle ve yönet', 
      icon: BookOpen, 
      color: 'green',
      route: '/student/my-lessons'
    },
    { 
      title: 'Profilim', 
      description: 'Kişisel bilgilerini görüntüle ve güncelle', 
      icon: User, 
      color: 'purple',
      route: '/student/profile'
    },
    { 
      title: 'Ders Programı', 
      description: 'Haftalık ders programını görüntüle', 
      icon: Calendar, 
      color: 'orange',
      route: '/student/schedule'
    }
  ];

  // API'den gelecek kayıtlı dersler - şimdilik boş
  const enrolledLessons = [];

  // API'den gelecek son işlemler - şimdilik boş  
  const recentActivities = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Öğrenci Paneli</h1>
                <p className="text-sm text-gray-600">Hoşgeldin, {user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  onClick={() => navigate(action.route)}
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium text-${action.color}-600 group-hover:text-${action.color}-700`}>
                      Git
                    </span>
                    <ChevronRight className={`w-4 h-4 text-${action.color}-600 ml-1 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enrolled Lessons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Kayıtlı Derslerim</h3>
                  <button 
                    onClick={() => navigate('/student/my-lessons')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Tümünü Gör
                  </button>
                </div>
              </div>
              <div className="p-6">
                {enrolledLessons.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledLessons.map((lesson) => (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{lesson.name}</h4>
                            <p className="text-sm text-gray-600">{lesson.instructor}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <Clock className="w-4 h-4 mr-1" />
                              {lesson.schedule}
                            </div>
                          </div>
                          <button className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz kayıtlı dersinin yok</h4>
                    <p className="text-gray-600 mb-4">Mevcut derslere göz atarak kayıt olmaya başlayabilirsin.</p>
                    <button
                      onClick={() => navigate('/student/lessons')}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ders Ara
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Son İşlemler</h3>
              </div>
              <div className="p-6">
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                          <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz işlem yok</h4>
                    <p className="text-gray-600">
                      Ders kayıt işlemlerin burada görünecek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ders Kaydına Başla</h3>
              <p className="text-indigo-100 mb-6">
                Yeni dönem için mevcut dersleri incele ve kayıt olmaya başla.
              </p>
              <button
                onClick={() => navigate('/student/lessons')}
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Dersleri İncele
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;