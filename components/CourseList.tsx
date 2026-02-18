import React from 'react';
import { Course } from '../types';
import { BookOpen, ArrowRight, MoreHorizontal, Users } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => {
        // Mock progress for visualization
        const progress = Math.floor(Math.random() * 40) + 20; 
        
        // Color coding based on course name/code
        let colorClass = 'bg-primary-600';
        let lightColorClass = 'bg-primary-50 text-primary-600';
        
        if (course.code.startsWith('SIL')) {
            colorClass = 'bg-emerald-600';
            lightColorClass = 'bg-emerald-50 text-emerald-600';
        } else if (course.code.startsWith('MM')) {
            colorClass = 'bg-blue-600';
            lightColorClass = 'bg-blue-50 text-blue-600';
        } else {
            colorClass = 'bg-purple-600';
            lightColorClass = 'bg-purple-50 text-purple-600';
        }

        return (
            <div 
            key={course.id} 
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer flex flex-col h-full hover:-translate-y-1"
            onClick={() => onSelectCourse(course)}
            >
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${lightColorClass} shadow-sm`}>
                        <BookOpen size={24} />
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 p-1">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                
                <span className="text-xs font-bold text-gray-400 mb-1">{course.code}</span>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-1">{course.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6">{course.description}</p>
                
                <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Progress Kelas</span>
                        <span className="font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <Users size={14} />
                    <span>32 Mhs</span>
                </div>
                <div className="flex items-center text-primary-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                Masuk Kelas <ArrowRight size={16} className="ml-2" />
                </div>
            </div>
            </div>
        );
      })}
    </div>
  );
};