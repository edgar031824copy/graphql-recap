import { Link, useParams } from 'react-router-dom';
import { useCompany } from '../api/useCompany.ts';

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, isLoadingCompany, error } = useCompany(companyId ?? '');

  if (isLoadingCompany) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="h-40 bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        Failed to load company.
      </p>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium">Company not found.</p>
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
        <header className="flex items-center gap-4">
          <div aria-hidden="true" className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center shrink-0">
            {company.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{company.jobs.length} open position{company.jobs.length !== 1 ? 's' : ''}</p>
          </div>
        </header>

        {company.description && (
          <section className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">About</h2>
            <p className="text-slate-700 leading-relaxed">{company.description}</p>
          </section>
        )}

        {company.jobs.length > 0 && (
          <section className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Open Positions</h2>
            <ul>
              {company.jobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-slate-800 font-medium hover:text-indigo-600 transition-colors"
                  >
                    {job.title}
                  </Link>
                  <time dateTime={job.date} className="text-xs text-slate-400">
                    {new Date(job.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
