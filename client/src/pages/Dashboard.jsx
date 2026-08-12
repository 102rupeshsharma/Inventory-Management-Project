import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchDashboardStats } from '../services/api';
import { getUser } from '../utils/auth';
import { 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  Layers, 
  PlusCircle, 
  CheckSquare, 
  AlertCircle, 
  Monitor, 
  ClipboardList, 
  GitPullRequest, 
  CheckCircle2, 
  Clock, 
  XCircle,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const user = useMemo(() => getUser() || { name: 'User', email: '', role: 'employee' }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, []);

  const roleConfig = {
    admin: {
      color: 'from-amber-500 to-orange-650',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/10',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    manager: {
      color: 'from-indigo-500 to-violet-650',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      bgColor: 'bg-indigo-500/10',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    employee: {
      color: 'from-emerald-500 to-teal-650',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/10',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  };

  const currentTheme = roleConfig[user.role] || roleConfig.employee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Aggregating portal metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${currentTheme.badge}`}>
                {user.role} Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-sans">
              Welcome back, <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.color}`}>{user.name}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Registered email: <span className="text-gray-800 font-medium">{user.email}</span>
            </p>
          </div>
          
          <button
            onClick={loadStats}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/10 transition-all text-gray-500 hover:text-purple-700 shadow-sm"
            title="Reload statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-250 text-red-750 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {user.role === 'admin' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              
              <Link to="/assets" className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4 hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{stats.totalAssets}</div>
                  <div className="text-xs text-gray-500">Total Assets</div>
                </div>
              </Link>

              <Link to="/assets?status=available" className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{stats.availableAssets}</div>
                  <div className="text-xs text-gray-500">Available Assets</div>
                </div>
              </Link>

              <Link to="/assets?status=assigned" className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4 hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{stats.assignedAssets}</div>
                  <div className="text-xs text-gray-500">Assigned Assets</div>
                </div>
              </Link>

              <Link to="/requests" className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4 hover:border-amber-300 hover:shadow-md transition-all group">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{stats.pendingRequests}</div>
                  <div className="text-xs text-gray-500">Pending Requests</div>
                </div>
              </Link>

              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-50 text-pink-700">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                  <div className="text-xs text-gray-500">Total Users</div>
                </div>
              </div>

            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Administrative Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/assets/new" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-all duration-205">
                  <PlusCircle className="w-5 h-5 text-purple-650" />
                  <div>
                    <h3 className="font-bold text-gray-800">Register New Asset</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Add hardware equipment or accessories to catalog.</p>
                  </div>
                </Link>
                <Link to="/requests" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-all duration-205">
                  <GitPullRequest className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-gray-800">Approve Request Tickets</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Review and authorize pending employee checkout queues.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {user.role === 'manager' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              <Link to="/assets?status=available" className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{stats.availableAssets}</div>
                  <div className="text-xs text-gray-500 mt-1">Available Assets</div>
                </div>
              </Link>

              <Link to="/requests" className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4 hover:border-amber-300 hover:shadow-md transition-all group">
                <div className="p-4 rounded-xl bg-amber-50 text-amber-700">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{stats.pendingRequests}</div>
                  <div className="text-xs text-gray-500 mt-1">Pending Requests</div>
                </div>
              </Link>

              <Link to="/requests?status=approved" className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4 hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="p-4 rounded-xl bg-purple-50 text-purple-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{stats.approvedRequests}</div>
                  <div className="text-xs text-gray-500 mt-1">Approved Requests History</div>
                </div>
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-650" />
                Inventory Controls
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/assets/new" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-colors">
                  <PlusCircle className="w-5 h-5 text-purple-650" />
                  <div>
                    <h3 className="font-bold text-gray-800">Register Asset</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Register new devices to company storage.</p>
                  </div>
                </Link>
                <Link to="/requests" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-colors">
                  <GitPullRequest className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-gray-800">Pending Requests</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Approve/Reject employee request logs.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
        {user.role === 'employee' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRequests}</div>
                  <div className="text-xs text-gray-500">Total Requests Filed</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.statusSummary.pending}</div>
                  <div className="text-xs text-gray-500">Pending Requests</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.statusSummary.approved}</div>
                  <div className="text-xs text-gray-500">Approved Assets</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.statusSummary.rejected}</div>
                  <div className="text-xs text-gray-500">Rejected Requests</div>
                </div>
              </div>

            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-emerald-600" />
                My Assigned Corporate Assets
              </h2>
              
              {stats.assignedAssets.length === 0 ? (
                <div className="bg-gray-50 border border-gray-150 p-8 rounded-xl text-center text-gray-500 text-sm">
                  You currently have no approved or assigned equipment under your ownership log.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.assignedAssets.map((asset) => (
                    <div 
                      key={asset._id} 
                      className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/5 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="font-bold text-gray-900 text-base">
                          {asset.name}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md">
                          Active Allocation
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <div className="text-gray-550 font-sans">Category:</div>
                        <div className="text-gray-800 font-medium text-right sm:text-left">{asset.category}</div>
                        
                        <div className="text-gray-550 font-sans">Serial Number:</div>
                        <div className="text-gray-850 font-mono text-right sm:text-left">{asset.serialNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-650" />
                Workspace Operations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/my-requests" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-colors">
                  <PlusCircle className="w-5 h-5 text-purple-650" />
                  <div>
                    <h3 className="font-bold text-gray-800">Request Device</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Submit request ticket logs for laptop or phone accessories.</p>
                  </div>
                </Link>
                <Link to="/my-requests" className="p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 rounded-xl flex items-center gap-3 transition-colors">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-gray-800">Check Request logs</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Monitor response statuses of requests submitted.</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
