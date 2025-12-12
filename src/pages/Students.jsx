import { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: 'all',
    grade: 'all',
    age: 'all',
    rating: 'all',
    search: ''
  });
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const res = await fetch('https://692376893ad095fb84709f35.mockapi.io/students');
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !student.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.gender !== 'all') {
      const studentGender = typeof student.gender === 'string' ? student.gender.toLowerCase() : (student.gender ? 'male' : 'female');
      if (studentGender !== filters.gender) return false;
    }

    if (filters.grade !== 'all' && student.grade.toString() !== filters.grade) {
      return false;
    }

    if (filters.age !== 'all') {
      const age = student.age;
      if (filters.age === '6-10' && (age < 6 || age > 10)) return false;
      if (filters.age === '11-14' && (age < 11 || age > 14)) return false;
      if (filters.age === '15-18' && (age < 15 || age > 18)) return false;
    }

    return true;
  });

  let sortedStudents = [...filteredStudents];
  if (filters.rating === 'highest') {
    sortedStudents.sort((a, b) => b.rating - a.rating);
  } else if (filters.rating === 'lowest') {
    sortedStudents.sort((a, b) => a.rating - b.rating);
  }

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const res = await fetch(`https://692376893ad095fb84709f35.mockapi.io/students/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const handleEdit = (id) => {
    
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedStudents.length)} of {sortedStudents.length} students
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search students..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <select
            value={filters.gender}
            onChange={(e) => setFilters({...filters, gender: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Gender</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
          </select>

          <select
            value={filters.grade}
            onChange={(e) => setFilters({...filters, grade: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Grades</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
            ))}
          </select>

          <select
            value={filters.age}
            onChange={(e) => setFilters({...filters, age: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Ages</option>
            <option value="6-10">6-10 years</option>
            <option value="11-14">11-14 years</option>
            <option value="15-18">15-18 years</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({...filters, rating: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Rating</option>
            <option value="highest">Highest First</option>
            <option value="lowest">Lowest First</option>
          </select>
        </div>
      </div>

      {paginatedStudents.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p className="text-lg">No students found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}