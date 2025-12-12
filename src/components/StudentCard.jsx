import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentCard({ student, onEdit, onDelete }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const displayGender = typeof student.gender === 'string' ? student.gender : (student.gender ? 'Male' : 'Female');

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/students/${student.id}`)}
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative h-20 w-20 mb-3">
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover ring-4 ring-purple-100 dark:ring-purple-900" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-purple-100 dark:ring-purple-900">
              {getInitials(student.name)}
            </div>
          )}
        </div>

        <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{student.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded border border-blue-500">
            Grade {student.grade}
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">{student.age}y</span>
        </div>

        <div className="w-full space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
              <span className="text-sm text-gray-900 dark:text-white">{student.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="8" cy="8" r="6" />
                <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
              </svg>
              <span className="text-sm text-gray-900 dark:text-white">{student.coins}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: `${Math.min((student.rating / 5) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
          </svg>
          <span className="truncate">{student.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
          <span className="truncate">{student.twitter}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <span className="truncate">{student.linkedin}</span>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(student.id); }}
          className="flex-1 px-4 py-2 text-sm border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
          className="flex-1 px-4 py-2 text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
