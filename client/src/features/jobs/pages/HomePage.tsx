import { useState } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../api/useJobs.ts";
import { useDeleteJob } from "../api/useDeleteJob.ts";
import TrashIcon from "../components/TrashIcon.tsx";

export default function HomePage() {
  const { jobs, isLoadingJobs, error } = useJobs();
  const { deleteJob, isDeletingJob } = useDeleteJob();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    setConfirmId(null);
  };

  if (isLoadingJobs) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
      >
        Failed to load jobs
      </p>
    );
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Open Positions</h1>
          <p className="text-slate-500 mt-1">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <Link
          to="/jobs/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          Post a Job
        </Link>
      </header>

      {jobs.length === 0 ? (
        <p className="text-center py-20 text-slate-400">
          No jobs posted yet. Be the first to post one.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <article className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between gap-4">
                <div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors"
                  >
                    {job.title}
                  </Link>
                  <div className="mt-1">
                    <Link
                      to={`/companies/${job.company.id}`}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {job.company.name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <time
                    dateTime={job.date}
                    className="text-xs text-slate-400 whitespace-nowrap"
                  >
                    {new Date(job.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>

                  {confirmId === job.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeletingJob}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isDeletingJob ? "…" : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(job.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-50"
                      aria-label={`Delete ${job.title}`}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
