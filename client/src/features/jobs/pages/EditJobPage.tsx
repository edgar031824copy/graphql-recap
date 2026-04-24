import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useJob } from '../api/useJob.ts';
import { useUpdateJob } from '../api/useUpdateJob.ts';
import PencilIcon from '../components/PencilIcon.tsx';

export default function EditJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, isLoadingJob, error: loadError } = useJob(jobId ?? '');
  const { updateJob, isUpdatingJob, error: updateError } = useUpdateJob(jobId ?? '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description ?? '');
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateJob({ title, description: description || undefined });
    navigate(`/jobs/${jobId}`);
  };

  if (isLoadingJob) {
    return (
      <div className="animate-pulse space-y-4 max-w-2xl">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  if (loadError || !job) {
    return (
      <p role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        Failed to load job.
      </p>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        to={`/jobs/${jobId}`}
        className="text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← Back to job
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-2">
        <span className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
          <PencilIcon size={18} />
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Edit Job</h1>
      </div>

      <p className="text-slate-500 mb-8">
        Updating listing at{' '}
        <Link to={`/companies/${job.company.id}`} className="text-indigo-600 hover:underline font-medium">
          {job.company.name}
        </Link>
      </p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {updateError && (
            <p role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {updateError.message}
            </p>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Job Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isUpdatingJob}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <PencilIcon size={13} />
              {isUpdatingJob ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/jobs/${jobId}`)}
              className="text-slate-600 hover:text-slate-900 px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
