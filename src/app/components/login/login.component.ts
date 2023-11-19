import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/loginService/login.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordError: string = '';
  userNameOrEmailError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    if (this.loginService.validateLoginStatus()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loginForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.passwordError = '';
      this.userNameOrEmailError = '';
    });
  }

  get emailOrUsernameControl() {
    return this.loginForm.get('emailOrUsername');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.emailOrUsernameControl?.value && this.passwordControl?.value) {
      const isEmail = this.emailOrUsernameControl.value.includes('@');
      let authBody;
      if (isEmail) {
        authBody = { email: this.emailOrUsernameControl.value };
      } else {
        authBody = { userName: this.emailOrUsernameControl.value };
      }
      authBody = { ...authBody, password: this.passwordControl.value };
      this.loginService.loginUser(authBody).subscribe({
        next: (res) => {
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          this.passwordError = '';
          this.userNameOrEmailError = '';
          if (err.status === 401) {
            this.passwordError = err.error['error'];
          }
          if (err.status === 404) {
            this.userNameOrEmailError = err.error['error'];
          }
        },
      });
    }
  }

  goToSignUp() {
    this.router.navigate(['/signup']); // Redirect to signup page
  }
}
