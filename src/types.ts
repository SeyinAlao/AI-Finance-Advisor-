
export interface SignupRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
}

export interface SignupResponse {
  message: string;
  status: string;
  error?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;     
  error?: string;     
}

export interface ChangePasswordRequest {
  old_password?: string; 
  new_password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ConfirmSignupRequest {
  email: string;
  token: string;
}

export interface AIRequestPayload {
  age: number; 
  investmentPurpose: string;
  investmentHorizon: number; 
  investmentKnowledge: string;
  riskTolerance: string;
  amount: number; 
  currency: string;
  location: string;
}

export interface AIResponse {
  status: string;
  data: {
    investmentAdvice: string;
  };
}

export interface Option {
  label: string;
  value: string;
}

export interface FormQuestions {
  id: number;
  text: string;
  name: string;
  options: Option[];
}

export interface Profile {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  isActive: boolean;
  status: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
}