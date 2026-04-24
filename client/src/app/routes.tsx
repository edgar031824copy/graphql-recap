import { Route, Routes } from 'react-router-dom';
import HomePage from '../features/jobs/pages/HomePage.tsx';
import JobPage from '../features/jobs/pages/JobPage.tsx';
import CreateJobPage from '../features/jobs/pages/CreateJobPage.tsx';
import EditJobPage from '../features/jobs/pages/EditJobPage.tsx';
import CompanyPage from '../features/companies/pages/CompanyPage.tsx';
import LoginPage from '../features/auth/pages/LoginPage.tsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      <Route path="/jobs/new" element={<CreateJobPage />} />
      <Route path="/jobs/:jobId" element={<JobPage />} />
      <Route path="/jobs/:jobId/edit" element={<EditJobPage />} />
      <Route path="/companies/:companyId" element={<CompanyPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
