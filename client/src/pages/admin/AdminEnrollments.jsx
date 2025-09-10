import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  UserCheck, 
  ChevronLeft,
  Search,
  Plus,
  Bell,
  Eye,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
  User,
  Calendar,
  X,
  Loader2,
  Mail,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLogoutMutation } from '../../store/api/authApi';
import { 
  useGetEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetAllStudentsForSelectQuery,
  useGetAllLessonsForSelectQuery
} from '../../store/api/adminApi';
import { logout } from '../../store/features/authSlice';
import { ROUTES, PAGINATION } from '../../utils/constants';

const AdminEnrollments = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    lessonId: ''
  });

  // RTK Query
  const { 
    data: enrollmentsData, 
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments
  } = useGetEnrollmentsQuery({ page, limit, search });

  const { 
    data: studentsData, 
    isLoading: studentsLoading 
  } = useGetAllStudentsForSelectQuery();

  const { 
    data: lessonsData, 
    isLoading: lessonsLoading 
  } = useGetAllLessonsForSelectQuery();
  
  const [createEnrollment, { isLoading: createLoading }] = useCreateEnrollmentMutation();
  const [deleteEnrollment, { isLoading: deleteLoading }] = useDeleteEnrollmentMutation();

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
    setPage(1);
  };

  const handleDeleteEnrollment = async (enrollmentId, studentName, lessonName) => {
    if (window.confirm(`${studentName} öğrencisinin ${lessonName} dersinden kaydını silmek istediğinize emin misiniz?`)) {
      try {
        await deleteEnrollment(enrollmentId).unwrap();
        toast.success('Kayıt başarıyla silindi!');
        refetchEnrollments();
      } catch (error) {
        toast.error('Kayıt silinirken hata oluştu: ' + (error.data?.message || error.message));
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.lessonId) {
      toast.error('Lütfen öğrenci ve ders seçiniz.');
      return;
    }

    try {
      await createEnrollment({
        studentId: formData.studentId,
        lessonId: formData.lessonId
      }).unwrap();
      toast.success('Öğrenci başarıyla derse kaydedildi!');
      closeModal();
      refetchEnrollments();
    } catch (error) {
      toast.error('Kayıt işlemi sırasında hata oluştu: ' + (error.data?.message || error.message));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({ studentId: '', lessonId: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getSelectedStudentName = () => {
    if (!formData.studentId || !studentsData?.students) return '';
    const student = studentsData.students.find(s => s._id === formData.studentId);
    return student ? `${student.firstName} ${student.lastName}` : '';
  };

  const getSelectedLessonName = () => {
    if (!formData.lessonId || !lessonsData?.lessons) return '';
    const lesson = lessonsData.lessons.find(l => l._id === formData.lessonId);
    return lesson ? lesson.name : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Kayıt İşlemleri</h1>
                <p className="text-sm text-gray-600">Öğrenci-ders eşleştirmelerini yönet</p>
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
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
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Toplam Kayıt
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {enrollmentsData?.pagination?.totalEnrollments || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Kayıtlı Öğrenci
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {studentsData?.pagination?.totalStudents || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Aktif Dersler
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {lessonsData?.pagination?.totalLessons || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Öğrenci veya ders ara..."
                  value={search}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Kayıt Oluştur
            </button>
          </div>

          {/* Enrollments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Öğrenci
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kayıt Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollmentsLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : enrollmentsError ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-red-600">
                        Kayıtlar yüklenirken hata oluştu: {enrollmentsError.data?.message || enrollmentsError.message}
                      </td>
                    </tr>
                  ) : enrollmentsData?.enrollments?.length > 0 ? (
                    enrollmentsData.enrollments.map((enrollment) => (
                      <tr key={enrollment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.student.firstName} {enrollment.student.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {enrollment.student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{enrollment.lesson.name}</div>
                              <div className="text-sm text-gray-500">
                                {enrollment.lesson.code} • {enrollment.lesson.credits} Kredi
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(enrollment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteEnrollment(
                              enrollment._id, 
                              `${enrollment.student.firstName} ${enrollment.student.lastName}`,
                              enrollment.lesson.name
                            )}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Kaydı Sil"
                            disabled={deleteLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Henüz kayıt bulunmamaktadır.</p>
                        <p className="text-sm">Yeni kayıt oluşturmak için yukarıdaki butona tıklayın.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {enrollmentsData?.pagination && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!enrollmentsData.pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!enrollmentsData.pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{((page - 1) * limit) + 1}</span>
                      {' - '}
                      <span className="font-medium">
                        {Math.min(page * limit, enrollmentsData.pagination.totalEnrollments)}
                      </span>
                      {' / '}
                      <span className="font-medium">{enrollmentsData.pagination.totalEnrollments}</span>
                      {' sonuç'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={!enrollmentsData.pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={!enrollmentsData.pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Enrollment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Kayıt Oluştur</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öğrenci Seç *
                  </label>
                  {studentsLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-sm text-gray-500">Öğrenciler yükleniyor...</span>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Öğrenci seçiniz...</option>
                      {studentsData?.students?.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.firstName} {student.lastName} ({student.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Seç *
                  </label>
                  {lessonsLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-sm text-gray-500">Dersler yükleniyor...</span>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.lessonId}
                      onChange={(e) => setFormData({...formData, lessonId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Ders seçiniz...</option>
                      {lessonsData?.lessons?.map((lesson) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.name} ({lesson.code}) - {lesson.credits} Kredi
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Seçim Özeti */}
                {(formData.studentId || formData.lessonId) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Kayıt Özeti:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {formData.studentId && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>Öğrenci: {getSelectedStudentName()}</span>
                        </div>
                      )}
                      {formData.lessonId && (
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>Ders: {getSelectedLessonName()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !formData.studentId || !formData.lessonId}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Kayıt Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="text-sm"
      />
    </div>
  );
};

export default AdminEnrollments;