import type { LoginRequest,LoginResponse, SignupRequest, SignupResponse, ChangePasswordRequest, PasswordResetRequest, ConfirmSignupRequest } from "../types";

const API_URL = import.meta.env.DEV ? "https://advisor-blush.vercel.app" : "";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const signupUser = async (userData: SignupRequest): Promise<SignupResponse> => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.token || data.access_token) {
        console.warn("Signup reported error (likely email), but token was found. Proceeding.");
        return data;
    }

    throw new Error(data.error || data.detail || 'Signup failed');
  }

  return data;
};

export const confirmUser = async (data: ConfirmSignupRequest) => {
  const response = await fetch(`${API_URL}/api/auth/confirm-signup`, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.detail || 'Confirmation failed');
  }

  return response.json();
};

export const loginUser = async (Credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`,{
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': "application/json",
    },
    body: JSON.stringify(Credentials),
  });

  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
        const errorData = await response.json();
        console.log(" THE SECRET ERROR IS:", JSON.stringify(errorData, null, 2));

        if (errorData.errors?.fieldErrors) {
            const firstFailedField = Object.keys(errorData.errors.fieldErrors)[0];
            const fieldErrorMessage = errorData.errors.fieldErrors[firstFailedField][0];
            errorMessage = `${firstFailedField}: ${fieldErrorMessage}`;
        } else {
            errorMessage = errorData.error || errorData.detail || errorData.message || JSON.stringify(errorData);
        }
    } catch {
        errorMessage = `Status: ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export const requestPasswordReset = async (Credentials: PasswordResetRequest): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/password-reset`, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': "application/json",
    },
    body: JSON.stringify(Credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset request failed');
  }

  return response.json();
};


export const resendVerificationLink = async (email: { email: string }) => {
  const response = await fetch(`${API_URL}/api/auth/resend-link`, {
    method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(email)
  });
  if (!response.ok) throw new Error('Failed to resend link');
  return response.json();
};
export const logoutUser = async () => {
  const email = sessionStorage.getItem('email'); 

  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email: email || "" }), 
    });

    if (!response.ok) {
        console.warn("Server logout failed, but clearing local session.");
    }
  } catch (error) {
    console.error("Logout network error:", error);
  } finally {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    window.location.href = '/login';
  }
};
export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await fetch(`${API_URL}/api/auth/change-password`, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      ...getAuthHeaders(), 
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'Validation failed. Check your token.');
    } catch {
      throw new Error('Server error: The token might be invalid or expired.');
    }
  }

  return response.json();
};