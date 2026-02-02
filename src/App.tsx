import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuestionPage from './pages/QuestionPage';
import DashboardPage from './pages/DashboardPages';
import PlanPage from './pages/PlanPage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/dashboard" element={<DashboardPage />}>
        <Route index element={<Navigate to="/dashboard/plan" replace />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/questionnaire" element={<QuestionPage />} />
    </Routes>
  );
}

export default App;