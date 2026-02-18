import { Course, Assignment, User, ForumPost } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'c-001',
    code: 'SIL-101',
    name: 'Sistem Informasi Lingkungan',
    description: 'Mempelajari pengelolaan data lingkungan menggunakan teknologi informasi.',
    lecturerId: 'lec-001'
  },
  {
    id: 'c-002',
    code: 'MM-202',
    name: 'Manajemen Mutu',
    description: 'Konsep dasar penjaminan kualitas dan standar ISO dalam industri.',
    lecturerId: 'lec-002'
  },
  {
    id: 'c-003',
    code: 'MET-303',
    name: 'Metodologi Penelitian',
    description: 'Teknik penyusunan proposal, pengumpulan data, dan analisis ilmiah.',
    lecturerId: 'lec-001'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-001',
    courseId: 'c-001',
    title: 'Analisis GIS Dasar (Kelas A)',
    description: 'Buat laporan analisis spasial area kampus menggunakan QGIS.',
    deadline: '2023-12-31T23:59',
    targetClass: 'A'
  },
  {
    id: 'a-002',
    courseId: 'c-002',
    title: 'Review Jurnal TQM (Semua Kelas)',
    description: 'Review 3 jurnal internasional tentang Total Quality Management.',
    deadline: '2023-11-20T23:59',
    targetClass: '' // All classes
  },
  {
    id: 'a-003',
    courseId: 'c-003',
    title: 'Draft Proposal Bab 1 (Kelas B)',
    description: 'Kumpulkan latar belakang dan rumusan masalah.',
    deadline: '2023-12-15T23:59',
    targetClass: 'B'
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p-001',
    courseId: 'c-003',
    authorId: 'lec-001',
    authorName: 'Dr. Budi Santoso',
    authorRole: 'lecturer',
    content: 'Selamat pagi, untuk perkuliahan Metopen minggu depan kita akan membahas Sampling. Harap baca Bab 5.',
    createdAt: new Date().toISOString(),
    replies: []
  },
  {
    id: 'p-002',
    courseId: 'c-001',
    authorId: 'stu-001',
    authorName: 'Ahmad Mahasiswa',
    authorRole: 'student',
    content: 'Izin bertanya pak, untuk tugas GIS apakah peta kontur wajib dimasukkan?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    replies: [
        {
            id: 'r-001',
            authorName: 'Dr. Budi Santoso',
            content: 'Ya, peta kontur wajib ada untuk analisis elevasi.',
            createdAt: new Date().toISOString()
        }
    ]
  }
];

// Mock Users for Login Simulation
export const MOCK_STUDENT: User = {
  id: 'stu-001',
  name: 'Ahmad Mahasiswa',
  email: 'ahmad@student.univ.ac.id',
  role: 'student',
  avatarUrl: 'https://picsum.photos/150/150',
  studentId: '20205011',
  class: 'A'
};

export const MOCK_LECTURER: User = {
  id: 'lec-001',
  name: 'Dr. Budi Santoso',
  email: 'budi@lecturer.univ.ac.id',
  role: 'lecturer',
  avatarUrl: 'https://picsum.photos/151/151',
  lecturerId: '99001122'
};