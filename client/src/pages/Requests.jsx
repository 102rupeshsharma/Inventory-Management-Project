import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchPendingRequests, approveRequest, rejectRequest } from '../services/api';
import { getUser } from '../utils/auth';
import { GitPullRequest, Check, X, User, ShieldAlert, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

const Requests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(() => getUser(), []);

  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'pending';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [status, setStatus] = useState(initialStatus);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'employee') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
 
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPendingRequests(status);
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch requests queue');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (currentUser && currentUser.role !== 'employee') {
      loadRequests();
    }
  }, [status]);
 
  const handleApprove = async (id) => {
    setError('');
    setSuccess('');
    setActionLoading(id);

    try {
      await approveRequest(id);
      setSuccess('Request approved successfully! The asset has been assigned to the employee.');
      
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };
 
  const handleReject = async (id) => {
    setError('');
    setSuccess('');
    setActionLoading(id);

    try {
      await rejectRequest(id);
      setSuccess('Request rejected successfully.');
       
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };
 
  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-455 border-rose-500/20'
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <GitPullRequest className="w-7 h-7 text-purple-650" />
              Requests Queue
            </h1>
            <p className="text-gray-555 text-xs sm:text-sm mt-1">
              Review and audit employee asset procurement request workflows.
            </p>
          </div>
  
          <div className="relative w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-xs text-gray-700 font-bold transition-colors appearance-none shadow-sm"
            >
              <option value="pending">Pending Requests</option>
              <option value="approved">Approved Requests</option>
              <option value="rejected">Rejected Requests</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
  
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
 
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
  
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-3 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-550 text-xs mt-3">Filtering requests queue...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 text-gray-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No requests found</h3>
            <p className="text-gray-500 text-xs max-w-sm mt-1">
              There are currently no {status} request logs in the system matching this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
              <thead className="bg-purple-700 text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">Requester</th>
                  <th scope="col" className="px-6 py-4">Requested Asset</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Serial Number</th>
                  <th scope="col" className="px-6 py-4">Requested Date</th>
                  <th scope="col" className="px-6 py-4 text-right">
                    {status === 'pending' ? 'Actions' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {requests.map((reqItem) => (
                  <tr key={reqItem._id} className="hover:bg-gray-50 transition-colors duration-150">
                     
                    <td className="px-6 py-6.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {reqItem.requestedBy ? reqItem.requestedBy.name : 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-550">
                            {reqItem.requestedBy ? reqItem.requestedBy.email : ''}
                          </div>
                        </div>
                      </div>
                    </td>
  
                    <td className="px-6 py-6.5 font-semibold text-gray-900">
                      {reqItem.assetId ? reqItem.assetId.name : 'N/A'}
                    </td>
  
                    <td className="px-6 py-6.5 text-gray-700">
                      {reqItem.assetId ? reqItem.assetId.category : 'N/A'}
                    </td>
  
                    <td className="px-6 py-6.5 font-mono text-xs text-gray-500">
                      {reqItem.assetId ? reqItem.assetId.serialNumber : 'N/A'}
                    </td>
  
                    <td className="px-6 py-6.5 text-xs text-gray-500">
                      {new Date(reqItem.requestedAt).toLocaleString()}
                    </td>
  
                    <td className="px-6 py-6.5 text-right">
                      {status === 'pending' ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleApprove(reqItem._id)}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {actionLoading === reqItem._id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
 
                          <button
                            onClick={() => handleReject(reqItem._id)}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {actionLoading === reqItem._id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${statusColors[reqItem.status] || 'bg-gray-100 text-gray-800'}`}>
                          {reqItem.status}
                        </span>
                      )}
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

export default Requests;
