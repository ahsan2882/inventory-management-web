import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/app/appConfig';
import {
  LoginBody,
  LoginResponse,
  SignUpResponse,
} from 'src/app/models/login/login.model';
import { UserData } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = `${SERVER_URL}/api/user`;
  }

  loginUser$(params: {
    email?: string;
    userName?: string;
    password: string;
  }): Observable<LoginResponse> {
    const { email, userName, password } = params;
    let body: LoginBody;
    if (userName) {
      body = { userName, password };
    } else {
      body = { email, password };
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponse>(`${this.baseURL}/login`, body, {
      headers,
    });
  }

  signUpUser$(userData: UserData): Observable<SignUpResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SignUpResponse>(`${this.baseURL}/signup`, userData, {
      headers,
    });
  }

  logoutUser(): void {
    sessionStorage.removeItem('token');
  }

  checkUserNameAvailability$(
    userName: string
  ): Observable<{ exists: boolean }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ exists: boolean }>(
      `${this.baseURL}/availability/userName`,
      { userName },
      { headers }
    );
  }

  checkEmailAvailability$(email: string): Observable<{ exists: boolean }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ exists: boolean }>(
      `${this.baseURL}/availability/email`,
      { email },
      { headers }
    );
  }
}
