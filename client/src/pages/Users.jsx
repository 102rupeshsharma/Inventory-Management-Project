import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/api';
import { getUser } from '../utils/auth';
import { Users as UsersIcon, Plus, AlertCircle, CheckCircle2, UserPlus, X, RefreshCw, Mail, User, Shield, Filter, Pencil, Trash } from 'lucide-react';

const Users = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getUser(), []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('employee');
  const [editFormError, setEditFormError] = useState('');
  const [editFormLoading, setEditFormLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadUsers();
    }
  }, [currentUser]);

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('employee');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!name || !email || !password) {
      setFormError('Name, email and password are required');
      return;
    }

    try {
      setFormLoading(true);
      await createUser({ name, email, password, role });
      setSuccess(`User "${name}" has been registered successfully!`);
      setIsModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Failed to register new user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEditModal = (userItem) => {
    setSelectedUser(userItem);
    setEditFormError('');
    setEditName(userItem.name);
    setEditEmail(userItem.email);
    setEditPassword('');
    setEditRole(userItem.role);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditFormError('');
    setSuccess('');

    if (!editName || !editEmail) {
      setEditFormError('Name and email are required');
      return;
    }

    try {
      setEditFormLoading(true);
      const updateData = { name: editName, email: editEmail, role: editRole };
      if (editPassword) {
        updateData.password = editPassword;
      }
      await updateUser(selectedUser._id, updateData);
      setSuccess(`User "${editName}" updated successfully!`);
      setIsEditModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
      setEditFormError(err.message || 'Failed to update user');
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (userItem) => {
    setSelectedUser(userItem);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUserSubmit = async () => {
    setSuccess('');
    setError('');
    try {
      setDeleteLoading(true);
      await deleteUser(selectedUser._id);
      setSuccess(`User "${selectedUser.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete user');
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleStyles = {
    admin: 'bg-amber-50 border border-amber-100 text-amber-700',
    manager: 'bg-purple-50 border border-purple-100 text-purple-700',
    employee: 'bg-emerald-50 border border-emerald-100 text-emerald-700'
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-550 text-sm">Loading users list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <UsersIcon className="w-7 h-7 text-purple-650" />
              User Management
            </h1>
            <p className="text-gray-555 text-xs sm:text-sm mt-1">
              Create, review, and manage credentials and permissions for administrative roles.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={loadUsers}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/10 transition-all text-gray-500 hover:text-purple-700 shadow-sm"
              title="Refresh users"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenModal}
              className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md shadow-purple-650/15"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </button>
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

        {users.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4 text-gray-400">
              <UsersIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No users found</h3>
            <p className="text-gray-500 text-xs mt-1">
              Currently no users are registered in the system database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
              <thead className="bg-purple-700 text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">User</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  <th scope="col" className="px-6 py-4">Role</th>
                  <th scope="col" className="px-6 py-4">Registered Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-700">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${roleStyles[item.role] || 'bg-gray-100 text-gray-800'}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Seed Account'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/10 shadow-sm transition-all"
                        title="Edit User"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        disabled={currentUser.id === item._id}
                        onClick={() => handleOpenDeleteConfirm(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-red-200 text-red-650 hover:border-red-300 hover:bg-red-50/30 disabled:opacity-40 disabled:pointer-events-none shadow-sm transition-all"
                        title={currentUser.id === item._id ? "You cannot delete your own account" : "Delete User"}
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl animate-fade-in relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-purple-700 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Create New Account</h3>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sarah Connor"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Role Permission *
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-700 appearance-none font-medium"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {formLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Create User</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl animate-fade-in relative">
            
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-purple-700 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                <Pencil className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Update User Account</h3>
            </div>

            {editFormError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g., Sarah Connor"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  New Password <span className="text-gray-400 font-normal lowercase">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Role Permission *
                </label>
                <div className="relative">
                  <select
                    value={editRole}
                    disabled={currentUser.id === selectedUser?._id}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-650 text-sm text-gray-700 appearance-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {currentUser.id === selectedUser?._id && (
                  <p className="text-[10px] text-gray-400 mt-1">You cannot modify your own administrative role permission.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editFormLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {editFormLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl text-center relative">
            
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-red-650">
              <Trash className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User Account</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete the user account for <strong className="text-gray-800 font-semibold">{selectedUser?.name}</strong> (<span className="font-mono text-gray-600">{selectedUser?.email}</span>)? This action is irreversible.
            </p>

            <div className="flex gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-grow py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteUserSubmit}
                className="flex-grow py-2.5 bg-red-600 hover:bg-red-750 text-white rounded-xl transition-all shadow-sm flex justify-center items-center gap-1.5"
              >
                {deleteLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
