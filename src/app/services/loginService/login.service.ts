import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/app/appConfig';
import { LoginResponse, LoginStatus } from 'src/app/models/login/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseURL: string;
  constructor(private http: HttpClient) {
    this.baseURL = `${SERVER_URL}/api/user`;
  }
  validateLoginStatus() {
    return !!sessionStorage.getItem('token');
  }
  logoutUser(): void {
    sessionStorage.removeItem('token');
  }
  loginUser(params: {
    email?: string;
    userName?: string;
    password: string;
  }): Observable<LoginResponse> {
    const { email, userName, password } = params;
    let body = {};
    if (userName) {
      body = { userName, password };
    } else {
      body = { email, password };
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(
      `${this.baseURL}/login`,
      {
        userName,
        password,
      },
      { headers }
    );
  }
}
