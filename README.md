# 🎓 EduGate - Sistem Akademik Terpadu

Platform manajemen akademik modern yang dirancang untuk memudahkan mahasiswa dan dosen dalam mengelola pembelajaran digital.

## ✨ Fitur Utama

- **📚 Manajemen Mata Kuliah** - Kelola daftar mata kuliah dengan deskripsi dan kode kursus
- **📝 Sistem Tugas** - Buat, kelola, dan lacak tugas dengan deadline yang jelas
- **🎯 Forum Diskusi** - Ruang kolaboratif untuk diskusi kelas dan tanya-jawab
- **🆔 Kartu Akses Digital** - Kartu identitas mahasiswa dalam format digital yang mudah diakses
- **📋 Dashboard Intuitif** - Tampilan ringkasan status akademik dalam satu layar
- **🔔 Notifikasi Real-time** - Pemberitahuan untuk tugas, pengumuman, dan aktivitas penting
- **📱 Responsive Design** - Bekerja sempurna di desktop, tablet, dan mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/uneeddeveloper/edugate.git
   cd edugate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

4. **Build untuk production**
   ```bash
   npm run build
   ```

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **UI Icons**: Lucide React
- **Deployment**: Vercel

## 📂 Project Structure

```
├── components/          # React components
│   ├── AssignmentManager.tsx
│   ├── CourseList.tsx
│   ├── Forum.tsx
│   ├── Assistant.tsx
│   ├── IDCard.tsx
│   ├── Login.tsx
│   └── ErrorBoundary.tsx
├── services/           # Service utilities
├── types.ts           # TypeScript types
├── constants.ts       # Mock data & constants
├── App.tsx            # Main app component
└── index.tsx          # Entry point
```

## 🎨 Fitur UI

- **Dark Sidebar Navigation** - Navigasi modern dengan design yang sleek
- **Modal Dialogs** - Interface untuk menambah kursus dan tugas
- **Responsive Cards** - Layout yang adaptif untuk semua ukuran layar
- **Toast Notifications** - Konfirmasi aksi dan pesan sistem
- **Loading States** - Indikator loading untuk better UX

## 👤 Login Demo

Aplikasi menggunakan data mock untuk demo. Coba login dengan akun apa pun untuk mengakses fitur-fitur.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 License

Project ini open source dan tersedia untuk pembelajaran dan pengembangan.

---

**Dibuat dengan ❤️ untuk ekosistem pendidikan digital**
