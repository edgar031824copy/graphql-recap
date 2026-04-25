import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useJob } from '../api/useJob.ts';
import { useDeleteJob } from '../api/useDeleteJob.ts';
import TrashIcon from '../components/TrashIcon.tsx';
import PencilIcon from '../components/PencilIcon.tsx';
import { useAuth } from '../../auth/context/AuthContext.tsx';
import type { ApolloError } from '@apollo/client';

function getGraphQLMessage(err: unknown): string {
  const apolloErr = err as ApolloError;
  return apolloErr?.graphQLErrors?.[0]?.message ?? 'Something went wrong';
}

export default function JobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, isLoadingJob, error } = useJob(jobId ?? '');
  const { deleteJob, isDeletingJob } = useDeleteJob();
  const [confirming, setConfirming] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!job) return;
    try {
      await deleteJob(job.id);
      navigate('/');
    } catch (err) {
      setConfirming(false);
      setDeleteError(getGraphQLMessage(err));
    }
  };

  if (isLoadingJob) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-40 bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        Failed to load job.
      </p>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium">Job not found.</p>
        <Link to="/" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 inline-flex items-center gap-1">
        ← All jobs
      </Link>

      <article className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 mt-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
            <Link
              to={`/companies/${job.company.id}`}
              className="inline-block mt-2 text-indigo-600 hover:underline font-medium"
            >
              {job.company.name}
            </Link>
          </div>
          <time
            dateTime={job.date}
            className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
          >
            {new Date(job.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </header>

        {job.description && (
          <section className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">About the role</h2>
            <p className="text-slate-700 leading-relaxed">{job.description}</p>
          </section>
        )}

        {user && (
          <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/jobs/${job.id}/edit`}
              className="text-sm text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <PencilIcon size={14} />
              Edit job
            </Link>

            {deleteError ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {deleteError}
                <button
                  onClick={() => setDeleteError(null)}
                  className="ml-1 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            ) : confirming ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Delete this job?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeletingJob}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isDeletingJob ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-sm text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <TrashIcon size={14} />
                Delete job
              </button>
            )}
          </footer>
        )}
      </article>
    </div>
  );
}
