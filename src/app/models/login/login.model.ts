export interface LoginStatus {
  id: string;
  isLoggedIn: boolean;
}

export interface LoginBody {
  userName?: string;
  email?: string;
  password: string;
}

export interface ValidationEmailBody {
  emailTo: string;
  fullName: string;
}

export interface ValidationCodeBody {
  email: string;
  code: string;
}
export interface LoginResponse {
  userId: string;
  message: string;
  token: string;
}

export interface ValidationEmailResponse {
  sentEmail: true;
}

export interface ValidationCodeResponse {
  validated: boolean;
  expired?: boolean;
}

export interface SignUpResponse {
  message: string;
  id: string;
  token: string;
}
