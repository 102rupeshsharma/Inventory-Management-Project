import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchAssetById, updateAsset } from '../services/api';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';

const EditAsset = () => {
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('available');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAssetDetails = async () => {
      try {
        const asset = await fetchAssetById(id);
        setName(asset.name);
        setCategory(asset.category);
        setSerialNumber(asset.serialNumber);
        setQuantity(asset.quantity);
        setStatus(asset.status);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to retrieve asset details. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    loadAssetDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !category || !serialNumber) {
      setError('All required fields must be filled');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setIsSaving(true);

    try {
      await updateAsset(id, {
        name,
        category,
        serialNumber,
        quantity: Number(quantity),
        status
      });

      navigate('/assets');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update asset. Check if the serial number is already in use.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Retrieving asset specifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <Link 
          to="/assets" 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-purple-750 transition-colors duration-150 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </Link>
 
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Modify Asset Details
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Update asset registration parameter logs. Ensure changes correspond with physical device audits.
          </p>
        </div>
 
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., MacBook Pro 16"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 transition-all duration-200"
                >
                  <option value="" disabled>-- Select Category --</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Other">Other</option>
                </select>
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g., MBP-2026-0012"
                  className="w-full px-4 py-3 bg-white border border-gray-350 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 placeholder-gray-400 transition-all duration-200"
                />
              </div>
 
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 transition-all duration-200"
                />
              </div>
 
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650 text-gray-900 transition-all duration-200"
                >
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
 
            </div>
 
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Link
                to="/assets"
                className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs border border-gray-300 rounded-xl transition-all duration-150 shadow-sm"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-650 hover:bg-purple-750 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-650/10 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
 
          </form>
 
        </div>
      </div>
    </div>
  );
};

export default EditAsset;
