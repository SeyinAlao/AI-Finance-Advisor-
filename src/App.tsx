import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuestionPage from './pages/QuestionPage';
import DashboardPage from './pages/DashboardPages'; // Fixed typo if it's DashboardPage
import PlanPage from './pages/PlanPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailsPage from './pages/HistoryDetailsPage'; // Added from your previous step!
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES: Only accessible if you are NOT logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* PROTECTED ROUTES: Only accessible if you HAVE a token */}
      <Route element={<ProtectedRoute />}>
        <Route path="/reset-password-now" element={<SettingsPage />} />
        <Route path="/questionnaire" element={<QuestionPage />} />
        
        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="/dashboard/plan" replace />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<HistoryDetailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;