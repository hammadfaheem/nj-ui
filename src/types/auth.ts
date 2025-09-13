export interface User {
  email: string;
  is_admin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  keep_logged_in?: boolean;
  recaptcha_token: string;
}

export interface TokenResponse {
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
  clearError: () => void;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  reenter_password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  terms_agreed: boolean;
  recaptcha_token: string;
}
