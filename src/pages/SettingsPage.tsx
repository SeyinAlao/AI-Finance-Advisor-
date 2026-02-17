import { User, Lock, Save, Loader2, ShieldCheck } from 'lucide-react';
import { useSettingsPageAction } from '../hooks/useSettingsPageAction';

const SettingsPage = () => {
  const { isResetting, userEmail, passwords, message, isLoading, handleChange, handleSave } = useSettingsPageAction();

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isResetting ? 'Secure Your Account' : 'Account Settings'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isResetting ? 'Please set your new password below.' : 'Manage your profile and security.'}
          </p>
        </div>
        {isResetting && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> RESET MODE
          </span>
        )}
      </div>

      {!isResetting && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" /> Profile Information
          </h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={userEmail} disabled className="w-full px-4 py-2 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 cursor-not-allowed" />
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-600" /> Security
        </h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <input type="text" name="username" value={userEmail} readOnly autoComplete="username" className="hidden" />

          {!isResetting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" name="current" autoComplete="current-password"
                value={passwords.current} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                required={!isResetting}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" name="new" autoComplete="new-password"
              value={passwords.new} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" name="confirm" autoComplete="new-password"
              value={passwords.confirm} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>
          <button 
            type="submit" disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? 'Updating...' : isResetting ? 'Reset Password' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;