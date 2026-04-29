import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../api/useCreateJob.ts";
import { useCompanies } from "../../companies/api/useCompanies.ts";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { createJob, isCreatingJob, error } = useCreateJob();
  const { companies, isLoadingCompanies } = useCompanies();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyId, setCompanyId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob({
      title,
      description: description || undefined,
      companyId,
    });
    navigate("/");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a New Job</h1>
      <p className="text-slate-500 mb-8">
        Fill in the details below to publish your listing.
      </p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
            >
              {error.message}
            </p>
          )}

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Company
            </label>
            <select
              id="company"
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={isLoadingCompanies}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select a company…</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Job Title
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe the role, responsibilities, requirements…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isCreatingJob}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {isCreatingJob ? "Publishing…" : "Publish Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
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
