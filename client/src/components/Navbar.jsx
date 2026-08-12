import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, LogOut, User, LayoutDashboard, ClipboardList, GitPullRequest, Users, ShieldAlert } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    onLogout();
    
    navigate('/login');
  };

  if (!user) return null;

  const roleStyles = {
    admin: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    manager: 'bg-purple-800 text-purple-200 border-purple-600',
    employee: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
  };

  const isLinkActive = (path) => {
    if (path === '/assets') {
      return location.pathname === '/assets' || location.pathname.startsWith('/assets/');
    }
    if (path === '/requests') {
      return location.pathname === '/requests' || location.pathname.startsWith('/requests/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-purple-700 border-b border-purple-800 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-xl text-purple-700">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-md tracking-tight">SmartAsset</span>
            </div>
 
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  isLinkActive('/dashboard') 
                    ? 'text-white bg-purple-800' 
                    : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
 
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link 
                  to="/assets"
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isLinkActive('/assets') 
                      ? 'text-white bg-purple-800' 
                      : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Assets</span>
                </Link>
              )}
 
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link 
                  to="/requests"
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isLinkActive('/requests') 
                      ? 'text-white bg-purple-800' 
                      : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Pending Requests</span>
                </Link>
              )}

              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/users"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isLinkActive('/users') 
                        ? 'text-white bg-purple-800' 
                        : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Link>

                  <Link 
                    to="/audit-logs"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isLinkActive('/audit-logs') 
                        ? 'text-white bg-purple-800' 
                        : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Audit Logs</span>
                  </Link>
                </>
              )}
 
              {user.role === 'employee' && (
                <Link 
                  to="/my-requests"
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isLinkActive('/my-requests') 
                      ? 'text-white bg-purple-800' 
                      : 'text-purple-200 hover:text-white hover:bg-purple-600/50'
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>My Requests</span>
                </Link>
              )}
            </div>
          </div>
 
          <div className="flex items-center gap-4">
            
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-purple-800 rounded-xl border border-purple-600">
              <User className="w-4 h-4 text-purple-200" />
              <span className="text-xs font-semibold text-white">{user.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleStyles[user.role] || roleStyles.employee}`}>
                {user.role}
              </span>
            </div>
 
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-purple-50 text-purple-700 font-semibold text-xs rounded-xl border border-purple-200 transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            
          </div>
 
        </div>
 
        <div className="md:hidden flex flex-wrap items-center gap-2.5 pb-3 pt-0.5 border-t border-purple-600/30">
          <Link 
            to="/dashboard"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isLinkActive('/dashboard') 
                ? 'text-white bg-purple-800' 
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
 
          {(user.role === 'admin' || user.role === 'manager') && (
            <>
              <Link 
                to="/assets"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isLinkActive('/assets') 
                    ? 'text-white bg-purple-800' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Assets
              </Link>
              <Link 
                to="/requests"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isLinkActive('/requests') 
                    ? 'text-white bg-purple-800' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Requests
              </Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link 
                to="/users"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isLinkActive('/users') 
                    ? 'text-white bg-purple-800' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Users
              </Link>
              <Link 
                to="/audit-logs"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isLinkActive('/audit-logs') 
                    ? 'text-white bg-purple-800' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Audit Logs
              </Link>
            </>
          )}
 
          {user.role === 'employee' && (
            <Link 
              to="/my-requests"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isLinkActive('/my-requests') 
                  ? 'text-white bg-purple-800' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              My Requests
            </Link>
          )}
        </div>
 
      </div>
    </nav>
  );
};

export default Navbar;
