import { useState, useEffect, useRef } from 'react';
import TeacherCard from '../components/TeacherCard';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: 'all',
    experience: 'all',
    rating: 'all',
    profession: 'all',
    search: ''
  });
  const [professions, setProfessions] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    gender: 'male',
    experience: '',
    rating: '',
    phone: '',
    age: '',
    avatar: '',
    twitter: '',
    linkedin: ''
  });
  
  const editModalRef = useRef(null);
  const addModalRef = useRef(null);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      try {
        const res = await fetch('https://692376893ad095fb84709f35.mockapi.io/teachers');
        if (!res.ok) throw new Error('Failed to fetch teachers');
        const data = await res.json();
        setTeachers(data);
        
        const uniqueProfessions = [...new Set(data.map(t => t.subject))];
        setProfessions(uniqueProfessions);
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (editModalOpen && editModalRef.current && !editModalRef.current.contains(event.target)) {
        setEditModalOpen(false);
      }
      if (addModalOpen && addModalRef.current && !addModalRef.current.contains(event.target)) {
        setAddModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editModalOpen, addModalOpen]);

  const filteredTeachers = teachers.filter(teacher => {
    if (filters.search && !teacher.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !teacher.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !teacher.subject.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.gender !== 'all') {
      const teacherGender = teacher.gender === true || teacher.gender === 'male' ? 'male' : 'female';
      if (teacherGender !== filters.gender) return false;
    }

    if (filters.experience !== 'all') {
      const exp = teacher.experience;
      if (filters.experience === '0-5' && (exp < 0 || exp > 5)) return false;
      if (filters.experience === '6-10' && (exp < 6 || exp > 10)) return false;
      if (filters.experience === '11-20' && (exp < 11 || exp > 20)) return false;
      if (filters.experience === '20+' && exp <= 20) return false;
    }

    if (filters.profession !== 'all' && teacher.subject !== filters.profession) {
      return false;
    }

    return true;
  });

  let sortedTeachers = [...filteredTeachers];
  if (filters.rating === 'highest') {
    sortedTeachers.sort((a, b) => b.rating - a.rating);
  } else if (filters.rating === 'lowest') {
    sortedTeachers.sort((a, b) => a.rating - b.rating);
  }

  const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = sortedTeachers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      const res = await fetch(`https://692376893ad095fb84709f35.mockapi.io/teachers/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditTeacher({
      ...teacher,
      gender: teacher.gender === true || teacher.gender === 'male' ? 'male' : 'female'
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const teacherToUpdate = {
        ...editTeacher,
        gender: editTeacher.gender === 'male',
        rating: parseFloat(editTeacher.rating) || 0,
        experience: parseInt(editTeacher.experience) || 0,
        age: parseInt(editTeacher.age) || 30
      };

      const res = await fetch(`https://692376893ad095fb84709f35.mockapi.io/teachers/${editTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherToUpdate)
      });
      
      if (!res.ok) throw new Error('Failed to update teacher');
      const updatedTeacher = await res.json();
      setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
      setEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSubmit = async () => {
    try {
      const teacherToAdd = {
        ...newTeacher,
        gender: newTeacher.gender === 'male',
        rating: parseFloat(newTeacher.rating) || 0,
        experience: parseInt(newTeacher.experience) || 0,
        age: parseInt(newTeacher.age) || 30
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherToAdd)
      };

      const res = await fetch('https://692376893ad095fb84709f35.mockapi.io/teachers', requestOptions);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to add teacher: ${res.status} ${res.statusText}`);
      }
      
      const addedTeacher = await res.json();
      setTeachers(prev => [...prev, addedTeacher]);
      setAddModalOpen(false);
      
      setNewTeacher({
        name: '',
        email: '',
        subject: '',
        gender: 'male',
        experience: '',
        rating: '',
        phone: '',
        age: '',
        avatar: '',
        twitter: '',
        linkedin: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const resetNewTeacher = () => {
    setNewTeacher({
      name: '',
      email: '',
      subject: '',
      gender: 'male',
      experience: '',
      rating: '',
      phone: '',
      age: '',
      avatar: '',
      twitter: '',
      linkedin: ''
    });
    setAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedTeachers.length)} of {sortedTeachers.length} teachers
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Add Teacher
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search teachers..."
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
            value={filters.experience}
            onChange={(e) => setFilters({...filters, experience: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Experience</option>
            <option value="0-5">0-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-20">11-20 years</option>
            <option value="20+">20+ years</option>
          </select>

          <select
            value={filters.profession}
            onChange={(e) => setFilters({...filters, profession: e.target.value})}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Professions</option>
            {professions.map(prof => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
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

      {paginatedTeachers.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p className="text-lg">No teachers found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedTeachers.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onEdit={() => handleEdit(teacher)}
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
                  ? 'bg-blue-500 text-white border-blue-500'
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

      {editModalOpen && editTeacher && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div ref={editModalRef} className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-2xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Edit Teacher</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editTeacher.name}
                  onChange={e => setEditTeacher({...editTeacher, name: e.target.value})}
                  placeholder="Teacher Name"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editTeacher.email}
                  onChange={e => setEditTeacher({...editTeacher, email: e.target.value})}
                  placeholder="Email"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={editTeacher.subject}
                  onChange={e => setEditTeacher({...editTeacher, subject: e.target.value})}
                  placeholder="Subject"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select
                  value={editTeacher.gender}
                  onChange={e => setEditTeacher({...editTeacher, gender: e.target.value})}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                <input
                  type="number"
                  value={editTeacher.experience}
                  onChange={e => setEditTeacher({...editTeacher, experience: e.target.value})}
                  placeholder="Years of Experience"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                <input
                  type="number"
                  value={editTeacher.rating}
                  onChange={e => setEditTeacher({...editTeacher, rating: e.target.value})}
                  placeholder="Rating"
                  step="0.1"
                  min="0"
                  max="5"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editTeacher.phone || ''}
                  onChange={e => setEditTeacher({...editTeacher, phone: e.target.value})}
                  placeholder="Phone Number"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Age</label>
                <input
                  type="number"
                  value={editTeacher.age}
                  onChange={e => setEditTeacher({...editTeacher, age: e.target.value})}
                  placeholder="Age"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
                <input
                  type="text"
                  value={editTeacher.twitter || ''}
                  onChange={e => setEditTeacher({...editTeacher, twitter: e.target.value})}
                  placeholder="Twitter Handle"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={editTeacher.linkedin || ''}
                  onChange={e => setEditTeacher({...editTeacher, linkedin: e.target.value})}
                  placeholder="LinkedIn Profile"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div ref={addModalRef} className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-2xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Add New Teacher</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                  placeholder="Teacher Name"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                  placeholder="Email"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTeacher.subject}
                  onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                  placeholder="Subject"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select
                  value={newTeacher.gender}
                  onChange={e => setNewTeacher({...newTeacher, gender: e.target.value})}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                <input
                  type="number"
                  value={newTeacher.experience}
                  onChange={e => setNewTeacher({...newTeacher, experience: e.target.value})}
                  placeholder="Years of Experience"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                <input
                  type="number"
                  value={newTeacher.rating}
                  onChange={e => setNewTeacher({...newTeacher, rating: e.target.value})}
                  placeholder="Rating"
                  step="0.1"
                  min="0"
                  max="5"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newTeacher.phone}
                  onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})}
                  placeholder="Phone Number"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Age</label>
                <input
                  type="number"
                  value={newTeacher.age}
                  onChange={e => setNewTeacher({...newTeacher, age: e.target.value})}
                  placeholder="Age"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
                <input
                  type="text"
                  value={newTeacher.twitter}
                  onChange={e => setNewTeacher({...newTeacher, twitter: e.target.value})}
                  placeholder="Twitter Handle"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={newTeacher.linkedin}
                  onChange={e => setNewTeacher({...newTeacher, linkedin: e.target.value})}
                  placeholder="LinkedIn Profile"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={resetNewTeacher}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={!newTeacher.name || !newTeacher.email || !newTeacher.subject}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}