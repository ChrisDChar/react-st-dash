import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard h-5 w-5 shrink-0">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      )
    },
    {
      path: '/teachers',
      label: 'Teachers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-5 w-5 shrink-0">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      path: '/students',
      label: 'Students',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-5 w-5 shrink-0">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
          <path d="M22 10v6"></path>
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
        </svg>
      )
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings h-5 w-5 shrink-0">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-900 min-h-screen fixed left-0 top-0 bottom-0 flex flex-col transition-all duration-300 z-50`}>
      <div className={`${isCollapsed ? 'px-4' : 'px-6'} py-6 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                <path d="M22 10v6"></path>
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
              </svg>
            </div>
            
            <span className={`text-white text-xl font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              Edu Admin
            </span>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-300 cursor-pointer shrink-0 ${isCollapsed ? 'ml-10' : ''}`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav className={`space-y-2 flex-1 ${isCollapsed ? 'px-3' : 'px-6'} transition-all duration-300`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg transition-all ${
                isCollapsed 
                  ? 'justify-center px-3 py-3' 
                  : 'gap-3 px-4 py-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`${isCollapsed ? 'px-3' : 'px-6'} pb-6 transition-all duration-300`}>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-lg text-gray-300 hover:bg-red-600 hover:text-white cursor-pointer transition-all ${
            isCollapsed 
              ? 'justify-center px-3 py-3' 
              : 'gap-3 px-4 py-3'
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out h-5 w-5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
          </div>
          
          {!isCollapsed && (
            <span className="font-medium whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}