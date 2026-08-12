import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuditLogs } from '../services/api';
import { getUser } from '../utils/auth';
import { ShieldAlert, RefreshCw, Search, Filter, Calendar, User, Eye, ClipboardList } from 'lucide-react';

const AuditLogs = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getUser(), []);

  // 1. Route guard - Admin only
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch audit log trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadLogs();
    }
  }, [currentUser]);

  // Unique actions list for filter select dropdown
  const uniqueActions = useMemo(() => {
    const actions = logs.map(l => l.action);
    return [...new Set(actions)];
  }, [logs]);

  // Filtered logs list
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        (log.user && log.user.name.toLowerCase().includes(search.toLowerCase())) ||
        (log.user && log.user.email.toLowerCase().includes(search.toLowerCase())) ||
        log.details.toLowerCase().includes(search.toLowerCase());
      
      const matchesAction = actionFilter ? log.action === actionFilter : true;

      return matchesSearch && matchesAction;
    });
  }, [logs, search, actionFilter]);

  const roleBadgeStyles = {
    admin: 'bg-amber-50 border border-amber-100 text-amber-700',
    manager: 'bg-purple-50 border border-purple-100 text-purple-700',
    employee: 'bg-emerald-50 border border-emerald-100 text-emerald-700'
  };

  const actionStyles = {
    'Asset Created': 'bg-emerald-50 text-emerald-750 border-emerald-100',
    'Asset Updated': 'bg-blue-50 text-blue-750 border-blue-100',
    'Asset Deleted': 'bg-rose-50 text-rose-750 border-rose-100',
    'Request Submitted': 'bg-amber-50 text-amber-750 border-amber-100',
    'Request Approved': 'bg-indigo-50 text-indigo-750 border-indigo-100',
    'Request Rejected': 'bg-gray-100 text-gray-700 border-gray-200'
  };

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-555 text-sm">Retrieving security audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-purple-650" />
              Security Audit Trail
            </h1>
            <p className="text-gray-555 text-xs sm:text-sm mt-1">
              Review history of asset management updates, request assignments, and role mutations.
            </p>
          </div>

          <button
            onClick={loadLogs}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/10 transition-all text-gray-500 hover:text-purple-700 shadow-sm self-end sm:self-auto"
            title="Refresh log list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter and Search Box */}
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-center shadow-sm">
          <div className="relative w-full sm:flex-grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user name, email or event details..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          <div className="w-full sm:w-48 relative">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-xs text-gray-700 font-semibold transition-colors appearance-none"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Logs Table Output */}
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 text-gray-400">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No logs matching criteria</h3>
            <p className="text-gray-500 text-xs mt-1">
              Try adjusting your keyword filter options or trigger user activity inside the system.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
              <thead className="bg-purple-700 text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">User</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                  <th scope="col" className="px-6 py-4">Details</th>
                  <th scope="col" className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div>
                          <div className="font-semibold text-gray-900">{log.user.name}</div>
                          <div className="text-[10px] font-semibold flex items-center gap-1 mt-0.5">
                            <span className="text-gray-500 font-normal">{log.user.email}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider border ${roleBadgeStyles[log.user.role]}`}>
                              {log.user.role}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-450 italic">Deleted Account</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold uppercase tracking-wider ${actionStyles[log.action] || 'bg-gray-100 text-gray-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-650 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuditLogs;
