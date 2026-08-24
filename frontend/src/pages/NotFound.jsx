import React from 'react';
import { Link } from 'react-router-dom';
import { Frown, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
        <Frown className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-button text-white font-bold text-xs shadow-md"
      >
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
