import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PostJobModal from './components/jobs/PostJobModal';

import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Protected Route Guard (Higher-Order Component Pattern):
// Wraps sensitive pages (/dashboard). Waits for session loading flag check,
// redirects unauthenticated users to /login using <Navigate replace />, and enforces role authorization if allowedRole is specified.
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-600">Loading Session...</span>
      </div>
    );
  }

  // Declarative Redirect: Navigates unauthenticated client to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function MainLayout() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenPostJob={() => setIsPostJobOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenPostJob={() => setIsPostJobOpen(true)} />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  isPostJobOpen={isPostJobOpen}
                  onClosePostJob={() => setIsPostJobOpen(true)}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Post Job Modal */}
      {isPostJobOpen && (
        <PostJobModal
          isOpen={isPostJobOpen}
          onClose={() => setIsPostJobOpen(false)}
          onJobCreated={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ToastProvider>
  );
}
