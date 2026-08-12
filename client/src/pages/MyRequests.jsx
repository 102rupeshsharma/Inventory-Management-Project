import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssets, fetchMyRequests, createRequest } from '../services/api';
import { getUser } from '../utils/auth';
import { ClipboardList, History, Box, AlertCircle, CheckCircle, RefreshCw, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const MyRequests = () => {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('Software'); // default software category

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const currentUser = useMemo(() => getUser(), []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'employee') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const loadAvailableAssets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const assetsData = await fetchAssets({
        search: debouncedSearch,
        category,
        status: 'available',
        page,
        limit: 10
      });
      setAvailableAssets(assetsData.assets || []);
      setTotal(assetsData.total || 0);
      setTotalPages(assetsData.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch available assets');
    } finally {
      setLoading(false);
    }
  };

  const loadRequestsHistory = async () => {
    try {
      const requestsData = await fetchMyRequests();
      setMyRequests(requestsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'employee') {
      loadAvailableAssets();
    }
  }, [debouncedSearch, category, page, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'employee') {
      loadRequestsHistory();
    }
  }, [currentUser]);

  const handleRefresh = async () => {
    await Promise.all([loadAvailableAssets(), loadRequestsHistory()]);
  };

  const handleRequestClick = async (assetId) => {
    setActionLoading(assetId);
    setError('');
    setSuccess('');

    try {
      await createRequest(assetId);
      setSuccess('Asset request submitted successfully!');
      await Promise.all([loadAvailableAssets(), loadRequestsHistory()]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit asset request');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  if (loading && availableAssets.length === 0 && myRequests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading your request workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
              Request Workspace
            </h1>
            <p className="text-gray-550 text-xs sm:text-sm mt-1">
              Browse available hardware inventory catalog and submit requests for device procurement.
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/10 transition-all text-gray-500 hover:text-purple-700 shadow-sm"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Box className="w-5 h-5 text-purple-650" />
              Available Corporate Assets
            </h2>

            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-center shadow-sm">
              <div className="relative w-full sm:flex-grow">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by asset name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-800 placeholder-gray-400 transition-colors"
                />
              </div>

              <div className="w-full sm:w-48 relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-xs text-gray-700 font-semibold transition-colors appearance-none"
                >
                  <option value="">All Categories</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Other">Other</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {availableAssets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
                <p className="text-sm text-gray-650">No assets are currently available for requesting.</p>
                <p className="text-xs text-gray-500 mt-1">Check back later or contact your system administrator.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableAssets.map((asset) => {
                    const isAlreadyRequested = myRequests.some(r => r.assetId && r.assetId._id === asset._id);
                    return (
                      <div 
                        key={asset._id} 
                        className="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all duration-300 group"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-purple-650 transition-colors">
                              {asset.name}
                            </h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md">
                              {asset.category}
                            </span>
                          </div>
                          <div className="space-y-1 font-mono text-[10px] text-gray-500">
                            <div>S/N: {asset.serialNumber}</div>
                            <div>Stock: {asset.quantity} unit(s)</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={actionLoading === asset._id || isAlreadyRequested}
                          onClick={() => handleRequestClick(asset._id)}
                          className={`w-full mt-5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex justify-center items-center gap-1.5 shadow-sm ${
                            isAlreadyRequested
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                              : 'bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200'
                          }`}
                        >
                          {actionLoading === asset._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : isAlreadyRequested ? (
                            'Requested'
                          ) : (
                            'Request Asset'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Showing <span className="font-semibold text-gray-800">{availableAssets.length}</span> of{' '}
                    <span className="font-semibold text-gray-800">{total}</span> available assets
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className="inline-flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                      <span>Previous</span>
                    </button>

                    <span className="text-xs text-gray-700 font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      className="inline-flex items-center gap-1 px-3.5 py-2 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
              <History className="w-5 h-5 text-purple-650" />
              Request History
            </h2>

            {myRequests.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-500 text-xs shadow-sm">
                You have not requested any assets yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {myRequests.map((reqItem) => (
                  <div 
                    key={reqItem._id} 
                    className="p-4 bg-white border border-gray-200 rounded-xl text-sm hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-bold text-gray-800">
                        {reqItem.assetId ? reqItem.assetId.name : 'Unknown Asset'}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColors[reqItem.status]}`}>
                        {reqItem.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 space-y-1">
                      <div>Category: {reqItem.assetId ? reqItem.assetId.category : 'N/A'}</div>
                      <div>S/N: {reqItem.assetId ? reqItem.assetId.serialNumber : 'N/A'}</div>
                      <div className="pt-1.5 text-[10px] text-gray-400 border-t border-gray-150 mt-1.5">
                        Requested: {new Date(reqItem.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyRequests;
