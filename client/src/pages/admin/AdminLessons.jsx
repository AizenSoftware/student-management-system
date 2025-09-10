import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  ChevronLeft,
  Search,
  Plus,
  Bell,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  User,
  UserCheck,
  X,
  Loader2,
  Mail,
  Phone
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { 
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetLessonStudentsQuery
} from '../../store/api/adminApi';
import { toast } from 'react-toastify';
import { logout } from '../../store/features/authSlice';
import { ROUTES, PAGINATION } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';

const AdminLessons = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_LIMIT);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    credits: '',
    instructor: '',
    maxCapacity: ''
  });

  // RTK Query
  const { 
    data: lessonsData, 
    isLoading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons
  } = useGetLessonsQuery({ page, limit, search });
  
  const { 
    data: lessonDetail, 
    isLoading: lessonDetailLoading 
  } = useGetLessonQuery(selectedLessonId, { 
    skip: !selectedLessonId 
  });

  // YENİ: Lesson students query
  const { 
    data: lessonStudentsData, 
    isLoading: lessonStudentsLoading,
    error: lessonStudentsError
  } = useGetLessonStudentsQuery(selectedLessonId, { 
    skip: !selectedLessonId || !showDetailModal
  });
  
  const [createLesson, { isLoading: createLoading }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: updateLoading }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: deleteLoading }] = useDeleteLessonMutation();

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

  const handleViewLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setShowDetailModal(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLessonId(lesson._id);
    setFormData({
      name: lesson.name,
      description: lesson.description || '',
      code: lesson.code,
      credits: lesson.credits.toString(),
      instructor: lesson.instructor || '',
      maxCapacity: lesson.maxCapacity.toString()
    });
    setShowEditModal(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Bu dersi silmek istediğinize emin misiniz?')) {
      try {
        await deleteLesson(lessonId).unwrap();
        toast.success('Ders başarıyla silindi!');
        refetchLessons();
      } catch (error) {
        toast.error('Ders silinirken hata oluştu: ' + (error.data?.message || error.message));
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLesson({
        ...formData,
        credits: parseInt(formData.credits),
        maxCapacity: parseInt(formData.maxCapacity)
      }).unwrap();
      toast.success('Ders başarıyla eklendi!');
      closeModals();
      refetchLessons();
    } catch (error) {
      toast.error('Ders eklenirken hata oluştu: ' + (error.data?.message || error.message));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLesson({
        id: selectedLessonId,
        ...formData,
        credits: parseInt(formData.credits),
        maxCapacity: parseInt(formData.maxCapacity)
      }).unwrap();
      toast.success('Ders başarıyla güncellendi!');
      closeModals();
      refetchLessons();
    } catch (error) {
      toast.error('Ders güncellenirken hata oluştu: ' + (error.data?.message || error.message));
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowDetailModal(false);
    setShowEditModal(false);
    setSelectedLessonId(null);
    setFormData({ name: '', description: '', code: '', credits: '', instructor: '', maxCapacity: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getCapacityStatus = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return { color: 'red', text: 'Neredeyse Dolu' };
    if (percentage >= 70) return { color: 'orange', text: 'Dolmak Üzere' };
    if (percentage >= 50) return { color: 'yellow', text: 'Yarı Dolu' };
    return { color: 'green', text: 'Müsait' };
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
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Ders Yönetimi</h1>
                <p className="text-sm text-gray-600">Dersleri görüntüle, ekle, düzenle ve sil</p>
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
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
          
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ders ara..."
                  value={search}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Ders Ekle
            </button>
          </div>

          {/* Lessons Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ders Bilgileri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Öğretmen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kredi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasite
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
                  {lessonsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : lessonsError ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-red-600">
                        Dersler yüklenirken hata oluştu: {lessonsError.data?.message || lessonsError.message}
                      </td>
                    </tr>
                  ) : lessonsData?.lessons?.length > 0 ? (
                    lessonsData.lessons.map((lesson) => {
                      const status = getCapacityStatus(lesson.enrolledStudentsCount, lesson.maxCapacity);
                      return (
                        <tr key={lesson._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{lesson.name}</div>
                                <div className="text-sm text-gray-500">{lesson.code}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lesson.instructor || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lesson.credits}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lesson.enrolledStudentsCount}/{lesson.maxCapacity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleViewLesson(lesson._id)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Detayları Görüntüle"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditLesson(lesson)}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                title="Düzenle"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson._id)}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                                disabled={deleteLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Henüz ders bulunmamaktadır.</p>
                        <p className="text-sm">Yeni ders eklemek için yukarıdaki butona tıklayın.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {lessonsData?.pagination && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!lessonsData.pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!lessonsData.pagination.hasNext}
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
                        {Math.min(page * limit, lessonsData.pagination.totalLessons)}
                      </span>
                      {' / '}
                      <span className="font-medium">{lessonsData.pagination.totalLessons}</span>
                      {' sonuç'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={!lessonsData.pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={!lessonsData.pagination.hasNext}
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

      {/* Add Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Ders Ekle</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kredi *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kapasite *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="500"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öğretmen
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Ders Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ders Düzenle</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kredi *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kapasite *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="500"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öğretmen
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Detail Modal - YENİ: Öğrenci Listesi ile */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ders Detayları</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {lessonDetailLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                </div>
              ) : lessonDetail?.lesson ? (
                <div>
                  {/* Ders Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ders Adı</p>
                        <p className="font-medium text-gray-900">{lessonDetail.lesson.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ders Kodu</p>
                        <p className="font-medium text-gray-900">{lessonDetail.lesson.code}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kredi</p>
                        <p className="font-medium text-gray-900">{lessonDetail.lesson.credits}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Öğretmen</p>
                        <p className="font-medium text-gray-900">{lessonDetail.lesson.instructor || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kapasite</p>
                        <p className="font-medium text-gray-900">
                          {lessonDetail.lesson.enrolledStudentsCount}/{lessonDetail.lesson.maxCapacity} öğrenci
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Oluşturulma Tarihi</p>
                        <p className="font-medium text-gray-900">{formatDate(lessonDetail.lesson.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Açıklama */}
                  {lessonDetail.lesson.description && (
                    <div className="mb-8 border-t border-gray-200 pt-6">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-2">Ders Açıklaması</p>
                          <p className="text-gray-900 leading-relaxed">{lessonDetail.lesson.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Kayıtlı Öğrenciler */}
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Kayıtlı Öğrenciler ({lessonDetail.lesson.enrolledStudentsCount})
                    </h5>
                    
                    {lessonStudentsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-green-600 animate-spin mr-2" />
                        <span className="text-gray-600">Öğrenciler yükleniyor...</span>
                      </div>
                    ) : lessonStudentsError ? (
                      <div className="text-center py-8">
                        <p className="text-red-600 mb-2">Öğrenciler yüklenirken hata oluştu</p>
                        <p className="text-sm text-gray-500">
                          {lessonStudentsError.data?.message || lessonStudentsError.message}
                        </p>
                      </div>
                    ) : lessonStudentsData?.students?.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {lessonStudentsData.students.map((studentEnrollment) => (
                          <div 
                            key={studentEnrollment._id} 
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900">
                                    {studentEnrollment.student.firstName} {studentEnrollment.student.lastName}
                                  </h6>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {studentEnrollment.student.email}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  Kayıt: {formatDate(studentEnrollment.createdAt)}
                                </div>
                                <div className="text-xs">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Aktif
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Bu derse henüz hiçbir öğrenci kayıtlı değil</p>
                        <p className="text-sm text-gray-400">
                          Öğrenciler ders kayıt sistemi üzerinden bu derse kayıt olabilir.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Ders bilgileri yüklenirken hata oluştu.</p>
                </div>
              )}
            </div>
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

export default AdminLessons;