import { useState } from 'react';
import { changePassword } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';

export const useSettingsPageAction = () => {
    const location = useLocation();
    const navigate = useNavigate();
     const resetTokenFromFlow = location.state?.token; // checks if password passed from forgot password flow is present in location state
  const isResetting = Boolean(resetTokenFromFlow); // if its present It enters reset mode otherwise normal settings mode

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false); 
  
  const userEmail = localStorage.getItem('email') || 'user@example.com';

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
      const activeToken = resetTokenFromFlow || localStorage.getItem('token') || ""; //checks if token is present if not localstorage and if not defaults to an empty string. 

      interface ChangePasswordPayload {
        new_password: string;
        token: string;
        current_password?: string;
      }

      const payload: ChangePasswordPayload = { //Basically this makes sure that the password follows the standard the API is expecting 
        new_password: passwords.new,
        token: activeToken
      };
      if (!isResetting) {
        payload.current_password = passwords.current; // current password is only needed for normal settings mode, not for reset mode where token is sufficient for authentication
      }

      await changePassword(payload); // it awaits completions 

      setMessage({ 
        type: 'success', 
        text: isResetting ? 'Password reset successful!' : 'Password updated!' // the message is different based on whether user is resetting password or just changing it from settings
      });
      
      setPasswords({ current: '', new: '', confirm: '' });

      if (isResetting) {
        setTimeout(() => navigate('/login'), 2000); // if its reset it waits 2 seconds and returns to login page so new password can be logged in 
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false); // loading state is reset 
    }
  };

  return{
    message,
    isLoading,
    passwords,
    isResetting,
    userEmail,
    handleChange,
    handleSave,
  }
}