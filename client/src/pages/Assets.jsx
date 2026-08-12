import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchAssets, deleteAsset } from '../services/api';
import { getUser } from '../utils/auth';
import AssetTable from '../components/AssetTable';
import DeleteModal from '../components/DeleteModal';
import { Plus, PackageOpen, AlertCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Assets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(() => getUser(), []);

  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || '';

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(initialStatus);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role === 'employee') {
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
  }, [debouncedSearch, category, status]);
  const loadAssets = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchAssets({
        search: debouncedSearch,
        category,
        status,
        page,
        limit: 10
      });

      setAssets(data.assets || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch inventory assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'employee') {
      loadAssets();
    }
  }, [debouncedSearch, category, status, page, currentUser]);

  const handleEditClick = (id) => {
    navigate(`/assets/edit/${id}`);
  };
  const handleDeleteClick = (id) => {
    const assetObj = assets.find(a => a._id === id);
    if (assetObj) {
      setAssetToDelete(assetObj);
      setIsModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;

    try {
      setError('');
      await deleteAsset(assetToDelete._id);

      setIsModalOpen(false);
      setAssetToDelete(null);
      await loadAssets();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete asset');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Asset Inventory
            </h1>
            <p className="text-gray-550 text-xs sm:text-sm mt-1">
              Verify, create, modify, and manage hardware/software catalog allocations.
            </p>
          </div>

          <Link
            to="/assets/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md shadow-purple-650/15"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </Link>
        </div>

        <div className="mb-6 p-4 flex flex-col md:flex-row gap-4 items-center">

          <div className="relative w-full md:flex-grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by asset name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-800 placeholder-gray-400 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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

            <div className="w-full sm:w-48 relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-xs text-gray-700 font-semibold transition-colors appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-550/10 border border-red-500/20 text-red-600 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-3 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-xs mt-3">Filtering assets catalog...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 text-gray-400">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No assets found</h3>
            <p className="text-gray-500 text-xs max-w-sm mt-1">
              No inventory entries matched your search criteria. Try modifying your search filters or clear inputs.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AssetTable
              assets={assets}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              currentUser={currentUser}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-800">{assets.length}</span> of{' '}
                <span className="font-semibold text-gray-800">{total}</span> assets registered
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
      {assetToDelete && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setAssetToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          assetName={assetToDelete.name}
        />
      )}

    </div>
  );
};

export default Assets;
