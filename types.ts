export type Role = 'student' | 'lecturer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  studentId?: string; // NIM
  lecturerId?: string; // NIDN
  class?: string; // e.g., 'A', 'B', 'C'
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  lecturerId: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  targetClass?: string; // 'A', 'B', or undefined (All)
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  fileUrl: string; // Mock URL
  fileName: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export interface ForumPost {
  id: string;
  courseId: string; // 'general' or specific course ID
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}