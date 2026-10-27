

export interface LoginFormData {
  email: string;
  password?: string; // Optional if using passwordless/OTP
}

export interface SignupFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string; 
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}
