import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_URL } from 'src/app/appConfig';
import {
  ValidationCodeBody,
  ValidationCodeResponse,
  ValidationEmailBody,
  ValidationEmailResponse,
} from 'src/app/models/login/login.model';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = `${SERVER_URL}/api/validate`;
  }

  validateLoginStatus() {
    return !!sessionStorage.getItem('token');
  }

  fetchAuthToken(): string | null {
    return sessionStorage.getItem('token');
  }

  sendEmailForValidation$(
    email: string,
    fullName: string
  ): Observable<ValidationEmailResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body: ValidationEmailBody = { emailTo: email, fullName };
    return this.http.post<ValidationEmailResponse>(
      `${this.baseURL}/email`,
      body,
      { headers }
    );
  }

  validateCode$(
    code: string,
    email: string
  ): Observable<ValidationCodeResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body: ValidationCodeBody = { code, email };
    return this.http.post<ValidationCodeResponse>(
      `${this.baseURL}/code`,
      body,
      { headers }
    );
  }
}
