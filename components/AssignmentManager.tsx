import React, { useState, useEffect } from 'react';
import { Assignment, Submission, User } from '../types';
import { FileText, Upload, CheckCircle, Clock, Plus, Pencil, Trash2, X, AlertTriangle, XCircle, Users, Download, Eye, EyeOff, FileCheck } from 'lucide-react';

interface AssignmentManagerProps {
  courseId: string;
  assignments: Assignment[];
  currentUser: User;
  onAddAssignment: (assignment: Assignment) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({ 
  courseId, 
  assignments, 
  currentUser,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment
}) => {
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    targetClass: ''
  });

  // Load submissions from storage
  useEffect(() => {
    const saved = localStorage.getItem(`submissions_${courseId}`);
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, [courseId]);

  const isLecturer = currentUser.role === 'lecturer';

  // Modal Handlers
  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', deadline: '', targetClass: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      targetClass: assignment.targetClass || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) return;

    if (editingId) {
      onUpdateAssignment({
        id: editingId,
        courseId,
        ...formData
      });
    } else {
      onAddAssignment({
        id: Date.now().toString(),
        courseId,
        ...formData
      });
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSubmission: Submission = {
        id: Date.now().toString(),
        assignmentId: assignmentId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentClass: currentUser.class,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // Local blob for demo
        submittedAt: new Date().toISOString(),
      };

      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      localStorage.setItem(`submissions_${courseId}`, JSON.stringify(updatedSubmissions));
      alert('Tugas berhasil dikumpulkan!');
    }
  };

  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  
  const courseAssignments = assignments.filter(a => {
      const isCorrectCourse = a.courseId === courseId;
      if (!isCorrectCourse) return false;
      if (isLecturer) return true;
      const isForMyClass = !a.targetClass || a.targetClass === currentUser.class;
      return isForMyClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Tugas</h2>
            <p className="text-sm text-gray-500">
                {isLecturer ? 'Kelola tugas untuk mahasiswa' : `Tugas untuk Kelas ${currentUser.class || 'Umum'}`}
            </p>
        </div>
        {isLecturer && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30"
          >
            <Plus size={18} /> Buat Tugas Baru
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {courseAssignments.length === 0 && (
          <div className="text-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Tidak ada tugas</h3>
            <p className="text-gray-500">
                {isLecturer 
                    ? "Anda belum membuat tugas untuk mata kuliah ini." 
                    : "Hore! Tidak ada tugas yang perlu dikerjakan saat ini."}
            </p>
          </div>
        )}

        {courseAssignments.map((assignment) => {
          const mySubmission = mySubmissions.find(s => s.assignmentId === assignment.id);
          const allSubmissionsForThis = submissions.filter(s => s.assignmentId === assignment.id);
          
          const deadlineDate = new Date(assignment.deadline);
          const now = new Date();
          const isDeadlinePassed = now > deadlineDate;
          const timeLeft = deadlineDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

          return (
            <div key={assignment.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 md:flex md:items-start md:justify-between gap-6">
                
                {/* Icon & Details */}
                <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isDeadlinePassed ? 'bg-red-100 text-red-600' : 
                        mySubmission ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                             {assignment.targetClass && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                                    Kelas {assignment.targetClass} Only
                                </span>
                             )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{assignment.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                             <div className={`flex items-center gap-1.5 ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                                <Clock size={14} />
                                {isDeadlinePassed ? (
                                    <span>Berakhir: {deadlineDate.toLocaleDateString()}</span>
                                ) : (
                                    <span>Deadline: {deadlineDate.toLocaleDateString()} ({daysLeft} hari lagi)</span>
                                )}
                             </div>
                             {isLecturer && (
                                <div className="flex items-center gap-1.5 text-primary-600">
                                    <Users size={14} />
                                    <span>{allSubmissionsForThis.length} Mengumpulkan</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 min-w-[140px]">
                    {isLecturer ? (
                        <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditModal(assignment)}
                              className="p-2 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => onDeleteAssignment(assignment.id)}
                              className="p-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ) : (
                        // Student Status Badge
                        mySubmission ? (
                             <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-100">
                                <CheckCircle size={16} /> Selesai
                             </span>
                        ) : isDeadlinePassed ? (
                             <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-100">
                                <XCircle size={16} /> Terlewat
                             </span>
                        ) : (
                             <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100">
                                <Clock size={16} /> Ditugaskan
                             </span>
                        )
                    )}

                    {isLecturer && (
                         <button 
                            onClick={() => setActiveAssignmentId(activeAssignmentId === assignment.id ? null : assignment.id)}
                            className="text-sm font-semibold text-primary-600 flex items-center gap-1 hover:underline"
                        >
                            {activeAssignmentId === assignment.id ? <EyeOff size={16} /> : <Eye size={16} />}
                            {activeAssignmentId === assignment.id ? 'Tutup' : 'Lihat'} Pengumpulan
                        </button>
                    )}
                </div>
              </div>

              {/* Student Upload Area */}
              {!isLecturer && !mySubmission && !isDeadlinePassed && (
                <div className="px-6 pb-6 pt-2">
                    <label className="flex items-center justify-between w-full p-4 transition-all bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 group">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                                <Upload size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-indigo-900 group-hover:text-indigo-700">Upload Pekerjaan</p>
                                <p className="text-xs text-indigo-400">PDF, Docx, atau ZIP (Max 10MB)</p>
                            </div>
                        </div>
                        <span className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">Pilih File</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, assignment.id)}
                        />
                    </label>
                </div>
              )}

              {/* Lecturer Submissions View */}
              {isLecturer && activeAssignmentId === assignment.id && (
                <div className="bg-gray-50 border-t border-gray-100 p-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Daftar Pengumpulan ({allSubmissionsForThis.length})</h4>
                    
                    {allSubmissionsForThis.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Belum ada mahasiswa yang mengumpulkan tugas ini.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-gray-500 border-b border-gray-200">
                                        <th className="py-2 font-semibold">Mahasiswa</th>
                                        <th className="py-2 font-semibold">Kelas</th>
                                        <th className="py-2 font-semibold">File</th>
                                        <th className="py-2 font-semibold">Waktu</th>
                                        <th className="py-2 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {allSubmissionsForThis.map(sub => {
                                        const isSubLate = new Date(sub.submittedAt) > deadlineDate;
                                        return (
                                            <tr key={sub.id} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                            {sub.studentName.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{sub.studentName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">
                                                        {sub.studentClass || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-blue-600 flex items-center gap-1">
                                                    <FileCheck size={14} />
                                                    <span className="truncate max-w-[150px]">{sub.fileName}</span>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-600">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                                        {isSubLate && <span className="text-[10px] text-red-500 font-bold">TERLAMBAT</span>}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button className="text-primary-600 hover:text-primary-800 text-xs font-bold bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                                                        Nilai
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingId ? 'Edit Tugas' : 'Buat Tugas Baru'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Tugas</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Contoh: Analisis Jurnal Minggu 1"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1.5">Target Mahasiswa</label>
                         <div className="relative">
                            <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                            <select
                                value={formData.targetClass}
                                onChange={(e) => setFormData({...formData, targetClass: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white transition-all appearance-none"
                            >
                                <option value="">Semua Kelas (Umum)</option>
                                <option value="A">Khusus Kelas A</option>
                                <option value="B">Khusus Kelas B</option>
                                <option value="C">Khusus Kelas C</option>
                            </select>
                         </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi / Instruksi</label>
                        <textarea 
                            required
                            rows={4}
                            placeholder="Jelaskan detail tugas di sini..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Batas Waktu (Deadline)</label>
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                    </div>
                    
                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20"
                        >
                            Simpan Tugas
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};