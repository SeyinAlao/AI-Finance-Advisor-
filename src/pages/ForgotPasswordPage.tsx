import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '../api/auth';
import { Mail, ArrowLeft } from 'lucide-react';

interface ResetResponse {
  message: string;
  token?: string; // The '?' means the token might be there or might not
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const mutation = useMutation({
    mutationFn: (emailVal: string) => requestPasswordReset({ email: emailVal }), // emailVal is like a placeholder for the email argument email value 
    onSuccess: (data: ResetResponse) => {
        console.log("API Data received:", data);
      if (data.message) {
        alert("Message received: ");
        navigate('/reset-password-now', { state: { token: data.message } });
      } else {
        setStatus({ 
          type: 'success', 
          message: 'If an account exists, a reset link has been sent.' 
        });
      }
    },
    onError: (error: Error) => {
      setStatus({ type: 'error', message: error.message || 'Failed to send request.' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    mutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Enter your email to receive a password reset link.
        </p>

        {status.message && (
          <div className={`mb-6 p-3 rounded-lg text-sm text-center ${
            status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                placeholder="you@example.com"
                required 
              />
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {mutation.isPending ? 'Processing...' : 'Send Reset Link'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/login')}
          className="mt-6 w-full text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;