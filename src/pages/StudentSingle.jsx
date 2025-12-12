import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function StudentSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      setLoading(true);
      try {
        const res = await fetch(`https://692376893ad095fb84709f35.mockapi.io/students/${id}`);
        if (!res.ok) throw new Error('Student not found');
        const data = await res.json();
        setStudent(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return 3.0;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (numRating >= 1 && numRating <= 5) return parseFloat(numRating.toFixed(1));
    if (numRating >= 0 && numRating <= 100) {
      return parseFloat((1 + (numRating / 100) * 4).toFixed(1));
    }
    return Math.min(5, parseFloat(numRating.toFixed(1)));
  };

  const handleEdit = () => {
    alert(`Edit student ${id} - Modal coming soon!`);
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
        <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-lg font-medium">Error loading details</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const displayGender = typeof student.gender === 'string' ? student.gender : (student.gender ? 'Male' : 'Female');
  const normalizedRating = normalizeRating(student.rating);
  const ratingPercentage = Math.min((normalizedRating / 5) * 100, 100);
  const coinsPercentage = Math.min(((student.coins || 0) / 5000) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/students" className="text-blue-600 dark:text-blue-400 hover:underline">
          Students
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600 dark:text-gray-400">{student.name}</span>
      </div>

      <button
        onClick={() => navigate('/students')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Students
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-32 w-32 mb-4">
              {student.avatar ? (
                <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover ring-4 ring-purple-100 dark:ring-purple-900" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-purple-100 dark:ring-purple-900">
                  {getInitials(student.name)}
                </div>
              )}
            </div>

            <h2 className="text-gray-900 dark:text-white text-xl font-bold mb-2">{student.name}</h2>

            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded border border-blue-500 mb-4">
              Grade {student.grade || 'N/A'}
            </span>

            <div className="w-full space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Age</span>
                <span className="text-gray-900 dark:text-white">{student.age || 'N/A'} years</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gender</span>
                <span className="text-gray-900 dark:text-white capitalize">{displayGender.toLowerCase()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">{normalizedRating}</span>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{width: `${ratingPercentage}%`}} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Coins</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">{student.coins || 0}</span>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{width: `${coinsPercentage}%`}} />
              </div>
            </div>

            <button
              onClick={handleEdit}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 grid grid-cols-3 gap-1 mb-6">
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Contact Info
            </button>
            <button className="text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/50 dark:hover:bg-gray-700/50 transition">
              Teacher
            </button>
            <button className="text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/50 dark:hover:bg-gray-700/50 transition">
              Statistics
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{student.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white truncate">{student.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Twitter</p>
                  <p className="text-gray-900 dark:text-white">{student.twitter || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                  <p className="text-gray-900 dark:text-white truncate">{student.linkedin || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}