import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, assetName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl animate-fade-in">

        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete Asset Confirmation</h3>
        </div>

        <p className="text-sm text-gray-650 mb-6 leading-relaxed">
          Are you sure you want to permanently delete the asset <span className="font-semibold text-gray-800">"{assetName}"</span>? This action cannot be reversed.
        </p>

        <div className="flex justify-end gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-350 rounded-xl transition-all duration-150"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 bg-rose-650 hover:bg-rose-750 text-white rounded-xl shadow-lg shadow-rose-650/15 transition-all duration-150"
          >
            Confirm Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteModal;
