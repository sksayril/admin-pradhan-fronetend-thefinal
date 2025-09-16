import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SocietyMember from './pages/society/SocietyMember';
import Payments from './pages/society/Payments';
import Loans from './pages/society/Loans';
import Penalty from './pages/society/Penalty';
import Students from './pages/student/Students';
import CourseBatch from './pages/student/CourseBatch';
import Certificate from './pages/student/Certificate';
import CertificateManagement from './pages/student/CertificateManagement';
import Marksheet from './pages/student/Marksheet';
import KYCDashboard from './pages/kyc/KYCDashboard';
import PendingKYC from './pages/kyc/PendingKYC';
import StudentKYCPage from './pages/kyc/StudentKYC';
import SocietyMemberKYCPage from './pages/kyc/SocietyMemberKYC';
import ApprovedKYC from './pages/kyc/ApprovedKYC';
import Courses from './pages/student/Courses';
import CourseBatches from './pages/student/CourseBatches';
import FeeManagement from './pages/student/FeeManagement';
import PaymentHistory from './pages/student/PaymentHistory';
import AttendanceManagement from './pages/student/AttendanceManagement';
import EnrollmentManagement from './pages/student/EnrollmentManagement';
import InvestmentPlansSociety from './pages/society/InvestmentPlans';
import PendingInvestmentApplications from './pages/society/PendingInvestmentApplications';
import ApprovedInvestmentApplications from './pages/society/ApprovedInvestmentApplications';
import RejectedInvestmentApplications from './pages/society/RejectedInvestmentApplications';
import ErrorBoundary from './components/ErrorBoundary';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <Login onLogin={() => {}} />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/society/members" element={<SocietyMember />} />
            <Route path="/society/payments" element={<Payments />} />
            <Route path="/society/loans" element={<Loans />} />
            <Route path="/society/penalty" element={<Penalty />} />
            <Route path="/student/students" element={<Students />} />
            <Route path="/student/course-batch" element={<CourseBatch />} />
            <Route path="/student/certificate" element={<Certificate />} />
            <Route path="/student/certificate-management" element={<CertificateManagement />} />
            <Route path="/student/marksheet" element={<Marksheet />} />
            <Route path="/student/courses" element={<Courses />} />
            <Route path="/student/course-batches" element={<CourseBatches />} />
            <Route path="/student/fee-management" element={<FeeManagement />} />
            <Route path="/student/payment-history" element={<PaymentHistory />} />
            <Route path="/student/attendance" element={<AttendanceManagement />} />
            <Route path="/student/enrollment-management" element={<EnrollmentManagement />} />
            <Route path="/society/investment-plans" element={<InvestmentPlansSociety />} />
            <Route path="/society/pending-investment-applications" element={<PendingInvestmentApplications />} />
            <Route path="/society/approved-investment-applications" element={<ApprovedInvestmentApplications />} />
            <Route path="/society/rejected-investment-applications" element={<RejectedInvestmentApplications />} />
            <Route path="/kyc" element={<KYCDashboard />} />
            <Route path="/kyc/pending" element={<PendingKYC />} />
            <Route path="/kyc/students" element={<StudentKYCPage />} />
            <Route path="/kyc/society-members" element={<SocietyMemberKYCPage />} />
            <Route path="/kyc/approved" element={<ApprovedKYC />} />
          </Routes>
        </Layout>
      )}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;