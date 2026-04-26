import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext.tsx';

export default function NavBar() {
  const { user, isInitializing, logout } = useAuth();

  return (
    <nav className="bg-slate-900 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">JB</span>
        <span className="text-white font-semibold tracking-wide">JobBoard</span>
      </Link>
      <div className="flex items-center gap-4">
        {/* Render nothing while /me is in-flight to avoid a flicker between states */}
        {!isInitializing && (
          user ? (
            <>
              <span className="text-slate-400 text-sm">{user.email}</span>
              <Link
                to="/jobs/new"
                className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                Post a Job
              </Link>
              <button
                onClick={() => logout()}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
