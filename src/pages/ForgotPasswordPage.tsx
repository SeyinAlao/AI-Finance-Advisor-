import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '../api/auth';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const mutation = useMutation({
        mutationFn: (emailVal: string) => requestPasswordReset({ email: emailVal }),
        
        onSuccess: (data) => {
            setStatus({ 
                type: 'success', 
                message: data.message || 'If an account exists, a reset link would be sent.' 
            });
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Forgot Password?
                </h2>
                <p className="text-center text-gray-500 text-sm mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {status.message && (
                    <div className={`mb-6 p-3 rounded-lg text-sm text-center ${
                        status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {/* Simple Arrow Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to Sign In
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordPage;