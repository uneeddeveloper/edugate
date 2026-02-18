import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { MOCK_STUDENT, MOCK_LECTURER } from '../constants';
import { LogIn, UserCircle, Users, BookOpen, Loader2, CheckCircle2, QrCode, Camera, X } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Simple Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'standard' | 'qr'>('standard');
  const [roleMode, setRoleMode] = useState<'student' | 'lecturer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<{name: string, email: string, avatar: string} | null>(null);
  
  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('A');
  
  // Lecturer Form State
  const [lecturerName, setLecturerName] = useState('Dr. Budi Santoso');

  // QR Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or switching modes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Simulate QR Detection after 3 seconds
      setTimeout(() => {
        handleQRDetected();
      }, 3000);

    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
      setIsScanning(false);
    }
  };

  const handleQRDetected = () => {
    stopCamera();
    // Simulate reading mock data from QR Code
    // In real app, this data comes from the decoder
    const mockQRData = {
        id: 'stu-qr-001',
        name: 'Ahmad Mahasiswa (Via QR)',
        email: 'ahmad@student.univ.ac.id',
        role: 'student' as const,
        studentId: '20205011',
        class: 'A',
        avatarUrl: 'https://picsum.photos/150/150'
    };
    
    setIsLoading(true);
    // Beep sound simulation or visual feedback
    setTimeout(() => {
        onLogin(mockQRData);
    }, 500);
  };

  // Simulate Google Login Flow
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        const mockGoogleProfile = {
            name: roleMode === 'student' ? 'Guntur Mahaputra' : 'Prof. Herman Susilo',
            email: roleMode === 'student' ? 'guntur.m@gmail.com' : 'herman.s@univ.ac.id',
            avatar: `https://ui-avatars.com/api/?name=${roleMode === 'student' ? 'Guntur+M' : 'Herman+S'}&background=random`
        };

        if (roleMode === 'lecturer') {
            const lecturer: User = {
                ...MOCK_LECTURER,
                id: `lec-google-${Date.now()}`,
                name: mockGoogleProfile.name,
                email: mockGoogleProfile.email,
                avatarUrl: mockGoogleProfile.avatar
            };
            onLogin(lecturer);
        } else {
            setGoogleUser(mockGoogleProfile);
            setStudentName(mockGoogleProfile.name);
            setIsLoading(false);
        }
    }, 1500);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleMode === 'student') {
        if (!studentName) return alert("Harap isi nama mahasiswa!");
        const newStudent: User = {
            ...MOCK_STUDENT,
            id: `stu-${Date.now()}`,
            name: studentName,
            email: googleUser ? googleUser.email : `${studentName.toLowerCase().replace(/\s/g, '.')}@student.univ.ac.id`,
            role: 'student',
            class: studentClass,
            avatarUrl: googleUser ? googleUser.avatar : 'https://picsum.photos/150/150'
        };
        onLogin(newStudent);
    } else {
        const lecturer: User = {
            ...MOCK_LECTURER,
            name: lecturerName
        };
        onLogin(lecturer);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-black/80 backdrop-blur-sm"></div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500 relative z-10 border border-white/20">
        
        {/* Left Side: Brand & Info */}
        <div className="w-full md:w-5/12 bg-primary-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/30">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduGate</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                    Sistem Akademik Terpadu
                </h1>
                <p className="text-primary-100 text-sm leading-relaxed opacity-90">
                    Satu pintu untuk pengelolaan tugas kuliah SIL, Manmut, dan Metopen. Terintegrasi, efisien, dan modern.
                </p>
             </div>

             <div className="mt-8 relative z-10">
                <div className="flex -space-x-4 mb-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-gray-200 flex items-center justify-center overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-primary-600 bg-primary-800 text-xs flex items-center justify-center text-white font-medium">
                        +2k
                    </div>
                </div>
                <p className="text-xs text-primary-200 font-medium">Bergabung dengan ribuan mahasiswa lainnya.</p>
             </div>
        </div>

        {/* Right Side: Login Forms */}
        <div className="w-full md:w-7/12 p-8 md:p-10 bg-white">
            
            {/* Method Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-fit mx-auto md:mx-0">
                <button
                    onClick={() => { setLoginMethod('standard'); stopCamera(); }}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        loginMethod === 'standard' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Login Akun
                </button>
                <button
                    onClick={() => { setLoginMethod('qr'); }}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        loginMethod === 'qr' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <QrCode size={16} /> Scan QR
                </button>
            </div>

            {loginMethod === 'standard' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Role Toggle */}
                    <div className="flex gap-4 mb-6">
                        <label className={`cursor-pointer border rounded-xl p-3 flex-1 transition-all ${roleMode === 'student' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="role" className="hidden" checked={roleMode === 'student'} onChange={() => { setRoleMode('student'); setGoogleUser(null); }} />
                            <div className="flex flex-col items-center gap-2">
                                <Users size={20} />
                                <span className="text-sm font-semibold">Mahasiswa</span>
                            </div>
                        </label>
                        <label className={`cursor-pointer border rounded-xl p-3 flex-1 transition-all ${roleMode === 'lecturer' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input type="radio" name="role" className="hidden" checked={roleMode === 'lecturer'} onChange={() => { setRoleMode('lecturer'); setGoogleUser(null); }} />
                            <div className="flex flex-col items-center gap-2">
                                <BookOpen size={20} />
                                <span className="text-sm font-semibold">Dosen</span>
                            </div>
                        </label>
                    </div>

                    {!googleUser && (
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 mb-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin text-gray-400" size={20} /> : <GoogleIcon />}
                            {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
                        </button>
                    )}

                    <form onSubmit={handleManualLogin} className="space-y-4">
                        {roleMode === 'student' ? (
                            <>
                                {googleUser ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in zoom-in duration-300">
                                        <div className="mt-1"><CheckCircle2 className="text-green-500" size={20} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Terhubung: {googleUser.name}</p>
                                            <p className="text-xs text-gray-500">{googleUser.email}</p>
                                            <p className="text-xs text-green-700 mt-1 font-medium">Lengkapi data kelas di bawah:</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserCircle className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Nama Lengkap"
                                            required
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="text-gray-400" size={18} />
                                    </div>
                                    <select
                                        value={studentClass}
                                        onChange={(e) => setStudentClass(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    >
                                        <option value="A">Kelas A (Pagi)</option>
                                        <option value="B">Kelas B (Siang)</option>
                                        <option value="C">Kelas C (Sore)</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BookOpen className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={lecturerName}
                                    onChange={(e) => setLecturerName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Nama Dosen"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 active:scale-[0.99] mt-2"
                        >
                            Masuk Portal
                        </button>
                    </form>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full justify-center items-center text-center">
                    {!isScanning ? (
                        <div className="space-y-6 max-w-xs">
                             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <QrCode className="text-gray-400 w-12 h-12" />
                             </div>
                             <h3 className="text-lg font-bold text-gray-800">Scan QR ID Card</h3>
                             <p className="text-gray-500 text-sm">Gunakan kamera perangkat Anda untuk memindai QR Code pada Kartu Akses untuk login cepat.</p>
                             <button
                                onClick={startCamera}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                             >
                                <Camera size={20} /> Buka Kamera
                             </button>
                        </div>
                    ) : (
                        <div className="w-full relative">
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-sm mx-auto shadow-inner">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    className="w-full h-full object-cover"
                                ></video>
                                {/* Scanning Overlay */}
                                <div className="absolute inset-0 border-2 border-primary-500/50 m-8 rounded-lg">
                                     <div className="w-full h-0.5 bg-primary-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#6366f1]"></div>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                                        Mencari kode QR...
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={stopCamera}
                                className="mt-6 text-gray-500 hover:text-red-500 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <X size={16} /> Batalkan Scan
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};