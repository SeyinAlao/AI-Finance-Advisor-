import { useState } from 'react';
import { changePassword } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ChangePasswordRequest } from '../types'; 

export const useSettingsPageAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetTokenFromFlow = location.state?.token;
  const isResetting = Boolean(resetTokenFromFlow);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false); 
  
  const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email') || 'user@example.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.new !== passwords.confirm) { 
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsLoading(true);

    try {
      const activeToken = resetTokenFromFlow || localStorage.getItem('token') || sessionStorage.getItem('token') || ""; 

      const payload: ChangePasswordRequest = { 
        newPassword: passwords.new, 
        token: activeToken
      };
      
      if (!isResetting) {
        payload.currentPassword = passwords.current; 
      }

      await changePassword(payload); 

      setMessage({ 
        type: 'success', 
        text: isResetting ? 'Password reset successful!' : 'Password updated!' 
      });
      
      setPasswords({ current: '', new: '', confirm: '' });

      if (isResetting) {
        setTimeout(() => navigate('/login'), 2000); 
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false); 
    }
  };

  return {
    message,
    isLoading,
    passwords,
    isResetting,
    userEmail,
    handleChange,
    handleSave,
  }
}