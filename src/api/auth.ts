import type { LoginRequest,LoginResponse, SignupRequest, SignupResponse, ChangePasswordRequest, PasswordResetRequest, ConfirmSignupRequest } from "../types";

const API_URL = "https://robo-advisor-backend-service.onrender.com"

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  };
};

export const signupUser = async (userData: SignupRequest): Promise<SignupResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
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
  const response = await fetch(`${API_URL}/auth/signup/confirm`, {
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
  const response = await fetch(`${API_URL}/auth/login`,{
    method: "POST",
    headers: {
      'accept': 'application/json',
      'Content-Type': "application/json",
    },
    body: JSON.stringify(Credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.detail || 'Login failed');
  }

  return response.json();
}

export const requestPasswordReset = async (Credentials: PasswordResetRequest): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/auth/password-reset`, {
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
  const response = await fetch(`${API_URL}/auth/resend-link`, {
    method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(email)
  });
  if (!response.ok) throw new Error('Failed to resend link');
  return response.json();
};
export const logoutUser = async () => {
  const email = sessionStorage.getItem('email'); 

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
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

export const changePassword = async (passwords: ChangePasswordRequest) => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: getAuthHeaders(), 
    body: JSON.stringify(passwords),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change password');
  }
  return response.json();
};