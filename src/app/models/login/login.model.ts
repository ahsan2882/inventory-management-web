export interface LoginStatus {
  id: string;
  isLoggedIn: boolean;
}
export interface LoginResponse {
  userId: string;
  message: string;
  token: string;
}
