
export interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userName: string;
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
  new_password: string;
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
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
  firstName: string;
  lastName: string;
  userName: string;
  isActive: boolean;
  status: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  userName?: string;
}

export interface HistoryItem {
  id?: string | number;
  created_at?: string;
  createdAt?: string;
}