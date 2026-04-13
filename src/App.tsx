import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const QuestionPage = lazy(() => import('./pages/QuestionPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPages')); 
const PlanPage = lazy(() => import('./pages/PlanPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const HistoryDetailsPage = lazy(() => import('./pages/HistoryDetailsPage')); 
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 space-y-4">
    <div className="relative flex justify-center items-center w-16 h-16">
      <div className="absolute w-full h-full rounded-full border-4 border-green-100 opacity-50"></div>
      <div className="absolute w-full h-full rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
    </div>
    <p className="text-green-800 font-medium text-sm tracking-wide animate-pulse">
      Loading your workspace...
    </p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/reset-password-now" element={<SettingsPage />} />
          <Route path="/questionnaire" element={<QuestionPage />} />
          
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<Navigate to="/dashboard/plan" replace />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:id" element={<HistoryDetailsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;