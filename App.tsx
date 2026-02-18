import React, { useState } from "react";
import { Login } from "./components/Login";
import { CourseList } from "./components/CourseList";
import { AssignmentManager } from "./components/AssignmentManager";
import { Forum } from "./components/Forum";
import { IDCard } from "./components/IDCard";
import { User, Course, Assignment } from "./types";
import { MOCK_COURSES, MOCK_ASSIGNMENTS } from "./constants";
import {
  LogOut,
  QrCode,
  Home,
  GraduationCap,
  ChevronRight,
  Plus,
  X,
  LayoutDashboard,
  Calendar,
  Bell,
  User as UserIcon,
  Check,
  Trash2,
  FileText,
  Menu,
} from "lucide-react";

// Simple Notification Interface
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "assignment" | "info";
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showIDCard, setShowIDCard] = useState(false);
  const [activeTab, setActiveTab] = useState<"assignments" | "forum">(
    "assignments",
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // State for courses
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  // State for assignments
  const [assignments, setAssignments] =
    useState<Assignment[]>(MOCK_ASSIGNMENTS);

  // State for Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Selamat Datang",
      message: "Selamat datang di semester baru!",
      time: "Baru saja",
      read: false,
      type: "info",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // State for Add Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    code: "",
    name: "",
    description: "",
  });

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);

    // Create a new notification when assignment is added
    const newNotif: Notification = {
      id: Date.now(),
      title: "Tugas Baru Ditambahkan",
      message: `Tugas "${newAssignment.title}" telah tersedia.`,
      time: "Baru saja",
      read: false,
      type: "assignment",
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a)),
    );
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseData.code || !newCourseData.name) return;

    const newCourse: Course = {
      id: `c-${Date.now()}`,
      code: newCourseData.code,
      name: newCourseData.name,
      description: newCourseData.description,
      lecturerId: user?.id || "",
    };

    setCourses([...courses, newCourse]);
    setIsCourseModalOpen(false);
    setNewCourseData({ code: "", name: "", description: "" });
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Calculate generic stats for dashboard
  const activeAssignmentsCount = assignments.length;
  const upcomingDeadlines = assignments.filter(
    (a) => new Date(a.deadline) > new Date(),
  ).length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans md:h-screen md:overflow-hidden">
      {/* Overlay for mobile menu */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Modern Dark Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 w-full max-w-xs md:max-w-none md:w-72 bg-slate-900 text-white h-screen md:h-screen z-40 transform transition-transform duration-300 flex flex-col ${
          showMobileMenu
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
            <div className="bg-primary-600 p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            EduGate
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400 px-6 pt-2">
          Sistem Akademik Terpadu
        </p>

        <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2 mt-2">
            Menu Utama
          </div>

          <button
            onClick={() => {
              setSelectedCourse(null);
              setShowMobileMenu(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 ${
              !selectedCourse
                ? "bg-primary-600 text-white shadow-lg shadow-primary-900/50"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={() => {
              setShowIDCard(true);
              setShowMobileMenu(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <QrCode size={20} /> Kartu Akses
          </button>

          <div className="mt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
            Mata Kuliah Anda
          </div>
          {courses.slice(0, 3).map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourse(course);
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                selectedCourse?.id === course.id
                  ? "bg-slate-800 text-primary-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  course.code.startsWith("SIL")
                    ? "bg-emerald-500"
                    : course.code.startsWith("MM")
                      ? "bg-blue-500"
                      : "bg-purple-500"
                }`}
              ></div>
              <span className="truncate">{course.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto relative md:h-screen"
        onClick={() => setShowProfileMenu(false)}
      >
        {/* Top Navbar Mobile/Tablet */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between md:justify-end gap-4 md:gap-0\">
          {/* Hamburger Button and Breadcrumb */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-500 flex-1">
              <span
                className="cursor-pointer hover:text-primary-600 font-medium"
                onClick={() => {
                  setSelectedCourse(null);
                  setShowMobileMenu(false);
                }}
              >
                Home
              </span>
              {selectedCourse && (
                <>
                  <ChevronRight size={14} />
                  <span className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                    {selectedCourse.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Dropdown Container */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-sm">
                      Notifikasi
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        title="Tandai semua dibaca"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        title="Hapus semua"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <p className="text-xs">Tidak ada notifikasi baru</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notif.read ? "opacity-60" : "bg-blue-50/30"}`}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notif.id ? { ...n, read: true } : n,
                              ),
                            );
                          }}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? "bg-gray-300" : "bg-primary-500"}`}
                            ></div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {notif.type === "assignment" && (
                                  <FileText
                                    size={12}
                                    className="text-primary-500"
                                  />
                                )}
                                <h4
                                  className={`text-xs ${notif.read ? "font-medium text-gray-600" : "font-bold text-gray-800"}`}
                                >
                                  {notif.title}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed mb-1">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img
                  src={user.avatarUrl}
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  alt={user.name}
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-gray-800 truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {user.role === "lecturer" ? "Dosen" : "Mahasiswa"}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={user.avatarUrl}
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                        alt={user.name}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.role === "lecturer" ? "Dosen" : "Mahasiswa"}
                        </p>
                        {user.role === "student" && user.class && (
                          <p className="text-xs text-gray-500">
                            Kelas {user.class}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUser(null);
                      setShowProfileMenu(false);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 font-medium text-sm"
                  >
                    <LogOut size={18} />
                    Keluar Aplikasi
                  </button>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </header>

        <div className="p-2 sm:p-4 md:p-8 max-w-7xl mx-auto pb-24 w-full">
          {selectedCourse ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Course Header Banner */}
              <div
                className={`rounded-3xl shadow-lg p-8 mb-8 text-white relative overflow-hidden ${
                  selectedCourse.code.startsWith("SIL")
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                    : selectedCourse.code.startsWith("MM")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-500"
                      : "bg-gradient-to-r from-purple-600 to-pink-500"
                }`}
              >
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                  <GraduationCap size={200} />
                </div>

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold mb-3">
                    {selectedCourse.code}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedCourse.name}
                  </h2>
                  <p className="text-white/90 max-w-2xl">
                    {selectedCourse.description}
                  </p>

                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} />
                      <span className="text-sm font-medium">
                        Pengajar:{" "}
                        {user?.role === "lecturer"
                          ? "Anda"
                          : "Dr. Budi Santoso"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">
                        Semester Ganjil 2023/2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("assignments")}
                  className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                    activeTab === "assignments"
                      ? "text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tugas & Pengumpulan
                  {activeTab === "assignments" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("forum")}
                  className={`pb-3 px-2 text-sm font-bold transition-all relative ${
                    activeTab === "forum"
                      ? "text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Forum Diskusi
                  {activeTab === "forum" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"></div>
                  )}
                </button>
              </div>

              {activeTab === "assignments" ? (
                <AssignmentManager
                  courseId={selectedCourse.id}
                  assignments={assignments}
                  currentUser={user}
                  onAddAssignment={handleAddAssignment}
                  onUpdateAssignment={handleUpdateAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                />
              ) : (
                <Forum courseId={selectedCourse.id} currentUser={user} />
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Total Matakuliah
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {courses.length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Tugas Aktif
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {activeAssignmentsCount}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Deadline Dekat
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {upcomingDeadlines}
                    </h3>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Matakuliah Terdaftar
                  </h2>
                  {user.role === "lecturer" && (
                    <button
                      onClick={() => setIsCourseModalOpen(true)}
                      className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                    >
                      <Plus size={16} /> Tambah Matakuliah
                    </button>
                  )}
                </div>

                <CourseList
                  courses={courses}
                  onSelectCourse={setSelectedCourse}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ID Card Modal */}
      <IDCard
        user={user}
        isOpen={showIDCard}
        onClose={() => setShowIDCard(false)}
      />

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                Tambah Mata Kuliah
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode MK
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: CS-101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  value={newCourseData.code}
                  onChange={(e) =>
                    setNewCourseData({ ...newCourseData, code: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Web"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  value={newCourseData.name}
                  onChange={(e) =>
                    setNewCourseData({ ...newCourseData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsi singkat tentang mata kuliah ini..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  value={newCourseData.description}
                  onChange={(e) =>
                    setNewCourseData({
                      ...newCourseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="flex-1 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
