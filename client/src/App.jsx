import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AddAsset from './pages/AddAsset';
import EditAsset from './pages/EditAsset';
import Requests from './pages/Requests';
import MyRequests from './pages/MyRequests';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import { getUser, isAuthenticated } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

      <Navbar user={user} onLogout={() => setUser(null)} />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={ user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={(u) => setUser(u)} /> }/>
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
          <Route path="/assets"  element={ <ProtectedRoute> <Assets /> </ProtectedRoute> } />
          <Route path="/assets/new" element={ <ProtectedRoute><AddAsset /></ProtectedRoute> } />
          <Route path="/assets/edit/:id" element={ <ProtectedRoute> <EditAsset /></ProtectedRoute> } />
          <Route path="/requests" element={ <ProtectedRoute> <Requests /> </ProtectedRoute> } />
          <Route path="/my-requests" element={ <ProtectedRoute> <MyRequests /> </ProtectedRoute> } />
          <Route path="/users" element={ <ProtectedRoute> <Users /> </ProtectedRoute> } />
          <Route path="/audit-logs" element={ <ProtectedRoute> <AuditLogs /> </ProtectedRoute> } />

          <Route path="/"  element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="*"  element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
