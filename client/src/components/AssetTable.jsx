import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const AssetTable = ({ assets, onEdit, onDelete, currentUser }) => {
  
  const statusStyles = {
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    assigned: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    maintenance: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const userRole = currentUser ? currentUser.role : 'employee';

  return (
    <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
        <thead className="bg-purple-700 text-xs font-bold uppercase tracking-wider text-white">
          <tr>
            <th scope="col" className="px-6 py-4">Asset Name</th>
            <th scope="col" className="px-6 py-4">Category</th>
            <th scope="col" className="px-6 py-4">Serial Number</th>
            <th scope="col" className="px-6 py-4">Quantity</th>
            <th scope="col" className="px-6 py-4">Status</th>
            <th scope="col" className="px-6 py-4">Created By</th>
            <th scope="col" className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {assets.map((asset) => (
            <tr key={asset._id} className="hover:bg-gray-50 transition-colors duration-150">

              <td className="whitespace-nowrap px-6 py-2 font-semibold text-gray-900">
                {asset.name}
              </td>
              
              <td className="whitespace-nowrap px-6 py-4.5 text-gray-700">
                {asset.category}
              </td>
              
              <td className="whitespace-nowrap px-6 py-4.5 font-mono text-xs text-gray-500">
                {asset.serialNumber}
              </td>
              
              <td className="whitespace-nowrap px-6 py-4.5 font-medium text-gray-900">
                {asset.quantity}
              </td>
              
              <td className="whitespace-nowrap px-6 py-4.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[asset.status] || 'bg-gray-100 text-gray-800'}`}>
                  {asset.status}
                </span>
              </td>
              
              <td className="whitespace-nowrap px-6 py-4.5 text-xs text-gray-500">
                {asset.createdBy ? asset.createdBy.name : 'System'}
              </td>
 
              <td className="whitespace-nowrap px-6 py-4.5 text-right space-x-2.5">
                {(userRole === 'admin' || userRole === 'manager') && (
                  <button
                    onClick={() => onEdit(asset._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold transition-all duration-200"
                    title="Edit Asset"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
 
                {userRole === 'admin' && (
                  <button
                    onClick={() => onDelete(asset._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold transition-all duration-200"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
