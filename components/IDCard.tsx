import React from 'react';
import { User } from '../types';
import { X, ShieldCheck, Wifi } from 'lucide-react';

interface IDCardProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const IDCard: React.FC<IDCardProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate a QR code URL
  const qrData = JSON.stringify({ id: user.id, role: user.role, email: user.email });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
        onClick={onClose} // Klik background untuk menutup
    >
      <div 
        className="relative group perspective-1000" 
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan saat klik pada kartu
      >
        {/* Close Button - Outside the card for better UX */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all backdrop-blur-sm"
          title="Tutup Kartu"
        >
          <X size={24} />
        </button>

        {/* The Physical Card Container */}
        <div className="w-[320px] h-[520px] bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[20px] shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/10 relative overflow-hidden flex flex-col items-center animate-in zoom-in duration-300 select-none">
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            {/* Holographic Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            {/* Lanyard Hole */}
            <div className="w-16 h-3 bg-black/50 rounded-full mt-4 border-t border-b border-white/10"></div>

            {/* Card Header */}
            <div className="w-full mt-6 px-6 flex justify-between items-start relative z-10">
                <div>
                    <h2 className="text-white font-bold tracking-widest text-lg">EDUGATE</h2>
                    <p className="text-[10px] text-indigo-300 uppercase tracking-wide font-medium">University Access Card</p>
                </div>
                <Wifi size={20} className="text-white/50 rotate-90" />
            </div>

            {/* Photo Section */}
            <div className="mt-8 relative z-10">
                <div className="w-32 h-32 rounded-xl border-2 border-white/20 p-1 relative shadow-lg bg-white/5 backdrop-blur-sm">
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-slate-900 shadow-lg">
                        <ShieldCheck size={16} />
                    </div>
                </div>
            </div>

            {/* User Details */}
            <div className="text-center mt-6 w-full px-6 relative z-10">
                <h3 className="text-xl font-bold text-white leading-tight mb-1">{user.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    user.role === 'student' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                    {user.role === 'student' ? 'Mahasiswa Aktif' : 'Dosen Pengajar'}
                </div>
                
                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
                    <div>
                        <span className="block text-[9px] uppercase opacity-50">ID Number</span>
                        <span className="font-mono text-white tracking-wide">{user.role === 'student' ? user.studentId : user.lecturerId}</span>
                    </div>
                    {user.class && (
                        <div>
                            <span className="block text-[9px] uppercase opacity-50">Class</span>
                            <span className="font-mono text-white tracking-wide">{user.class}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-auto mb-8 bg-white p-3 rounded-xl shadow-lg relative z-10 mx-6">
                <img src={qrUrl} alt="QR Code" className="w-24 h-24 mix-blend-multiply opacity-90" />
            </div>

            {/* Decorative Bottom Bar */}
            <div className={`absolute bottom-0 left-0 w-full h-1.5 ${user.role === 'student' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
        </div>
      </div>
    </div>
  );
};