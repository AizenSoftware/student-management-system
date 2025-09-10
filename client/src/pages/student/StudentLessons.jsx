import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  ChevronLeft,
  Search,
  GraduationCap,
  Bell,
  User,
  Calendar,
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { 
  useGetAvailableLessonsQuery,
  useEnrollInLessonMutation 
} from '../../store/api/studentApi';
import { logout } from '../../store/features/authSlice';
import { ROUTES, PAGINATION } from '../../utils/constants';

const StudentLessons = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [enrollingLessonId, setEnrollingLessonId] = useState(null);

  // RTK Query
  const { 
    data: lessonsData, 
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons
  } = useGetAvailableLessonsQuery({ page, limit, search });
  
  const [enrollInLesson, { isLoading: enrollLoading }] = useEnrollInLessonMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleEnrollLesson = async (lessonId, lessonName) => {
    if (window.confirm(`"${lessonName}" dersine kayıt olmak istediğinize emin misiniz?`)) {
      setEnrollingLessonId(lessonId);
      try {
        await enrollInLesson({ lessonId }).unwrap();
        alert('Derse başarıyla kayıt oldunuz!');
        refetchLessons(); // Listeyi yenile
      } catch (error) {
        alert('Ders kaydı sırasında hata oluştu: ' + (error.data?.message || error.message));
      } finally {
        setEnrollingLessonId(null);
      }
    }
  };

  const getCapacityColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getCapacityText = (enrolled, max) => {
    const available = max - enrolled;
    if (available <= 0) return 'Dolu';
    if (available <= 3) return `${available} kişi kaldı`;
    return `${available} boş yer`;
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Ders Ara & Kayıt Ol</h1>
                <p className="text-sm text-gray-600">Mevcut dersleri keşfedin ve kayıt olun</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ders adı, kodu veya öğretim görevlisi ara..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {PAGINATION.LIMITS.map(size => (
                  <option key={size} value={size}>{size} ders</option>
                ))}
              </select>
              <button
                onClick={() => navigate(ROUTES.STUDENT.MY_LESSONS)}
                className="inline-flex items-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Kayıtlı Derslerim
              </button>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Mevcut Dersler
                {lessonsData?.pagination && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({lessonsData.pagination.totalLessons} ders bulundu)
                  </span>
                )}
              </h3>
              {search && (
                <div className="flex items-center text-sm text-gray-600">
                  <Search className="w-4 h-4 mr-1" />
                  "{search}" için sonuçlar
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {lessonsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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
            ) : lessonsData?.lessons?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {lessonsData.lessons.map((lesson) => (
                    <div key={lesson._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{lesson.name}</h4>
                              <p className="text-sm text-gray-500">{lesson.code}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{lesson.instructor}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{lesson.credits} Kredi</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">
                            {lesson.enrolledStudentsCount}/{lesson.maxCapacity} öğrenci
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCapacityColor(lesson.enrolledStudentsCount, lesson.maxCapacity)}`}>
                            {getCapacityText(lesson.enrolledStudentsCount, lesson.maxCapacity)}
                          </span>
                        </div>

                        {lesson.description && (
                          <div className="text-sm text-gray-600 border-t pt-3">
                            <p className="line-clamp-2">{lesson.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Oluşturulma: {new Date(lesson.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                        <button
                          onClick={() => handleEnrollLesson(lesson._id, lesson.name)}
                          disabled={
                            enrollingLessonId === lesson._id || 
                            lesson.enrolledStudentsCount >= lesson.maxCapacity
                          }
                          className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
                            lesson.enrolledStudentsCount >= lesson.maxCapacity
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {enrollingLessonId === lesson._id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Kayıt Ediliyor...
                            </>
                          ) : lesson.enrolledStudentsCount >= lesson.maxCapacity ? (
                            <>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Dolu
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Kayıt Ol
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {lessonsData?.pagination && lessonsData.pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={!lessonsData.pagination.hasPrev}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Önceki
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700">
                        {page} / {lessonsData.pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={!lessonsData.pagination.hasNext}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {search ? 'Aradığınız kriterlere uygun ders bulunamadı' : 'Henüz kayıt olabileceğiniz ders yok'}
                </h4>
                <p className="text-gray-600 mb-6">
                  {search 
                    ? 'Farklı anahtar kelimelerle arama yapabilir veya filtreleri değiştirebilirsiniz.'
                    : 'Tüm mevcut derslere kayıt olmuş olabilirsiniz.'
                  }
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLessons;