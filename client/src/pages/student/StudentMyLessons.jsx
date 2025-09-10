import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  ChevronLeft,
  GraduationCap,
  Bell,
  User,
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { 
  useGetMyLessonsQuery,
  useDropFromLessonMutation 
} from '../../store/api/studentApi';
import { logout } from '../../store/features/authSlice';
import { ROUTES } from '../../utils/constants';

const StudentMyLessons = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  
  // RTK Query
  const { 
    data: myLessonsData, 
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons
  } = useGetMyLessonsQuery();
  
  const [dropFromLesson, { isLoading: dropLoading }] = useDropFromLessonMutation();

  // State
  const [droppingLessonId, setDroppingLessonId] = useState(null);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleDropLesson = async (lessonId, lessonName) => {
    if (window.confirm(`"${lessonName}" dersinden çıkmak istediğinize emin misiniz?`)) {
      setDroppingLessonId(lessonId);
      try {
        await dropFromLesson(lessonId).unwrap();
        alert('Ders kaydınız başarıyla silindi');
        refetchLessons(); // Listeyi yenile
      } catch (error) {
        alert('Ders kaydı silinirken hata oluştu: ' + (error.data?.message || error.message));
      } finally {
        setDroppingLessonId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Kayıtlı Derslerim</h1>
                <p className="text-sm text-gray-600">Aldığınız dersleri görüntüleyin ve yönetin</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Ders Özeti</h2>
              <div className="flex items-center space-x-6 text-indigo-100">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Toplam: {myLessonsData?.totalEnrollments || 0} ders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Aktif dönem</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <GraduationCap className="w-16 h-16 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Lessons Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Kayıtlı Derslerim</h3>
              <button
                onClick={() => navigate('/student/lessons')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ders Ekle
              </button>
            </div>
          </div>

          <div className="p-6">
            {lessonsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : lessonsError ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Dersler yüklenirken hata oluştu</p>
                <p className="text-sm text-gray-500 mb-4">
                  {lessonsError.data?.message || lessonsError.message}
                </p>
                <button
                  onClick={() => refetchLessons()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : myLessonsData?.enrollments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLessonsData.enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{enrollment.lesson.name}</h4>
                            <p className="text-sm text-gray-500">{enrollment.lesson.code}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDropLesson(enrollment.lesson._id, enrollment.lesson.name)}
                        disabled={droppingLessonId === enrollment.lesson._id}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Dersten Çık"
                      >
                        {droppingLessonId === enrollment.lesson._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{enrollment.lesson.instructor}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{enrollment.lesson.credits} Kredi</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Kayıt: {formatDate(enrollment.createdAt)}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Aktif</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Durum</span>
                        <span className="text-green-600 font-medium">Kayıtlı</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz kayıtlı dersiniz yok</h4>
                <p className="text-gray-600 mb-6">
                  Mevcut derslere göz atarak kayıt olmaya başlayabilirsiniz.
                </p>
                <button
                  onClick={() => navigate('/student/lessons')}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ders Arayın
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {myLessonsData?.enrollments?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ders</p>
                  <p className="text-2xl font-bold text-gray-900">{myLessonsData.totalEnrollments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Kredi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myLessonsData.enrollments?.reduce((total, enrollment) => total + (enrollment.lesson.credits || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Durum</p>
                  <p className="text-2xl font-bold text-gray-900">Aktif</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentMyLessons;