import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validationService/validation.service';
import { debounceTime } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

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
    private router: Router,
    private validationService: ValidationService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.validationService.validateLoginStatus()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
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
    const emailOrUserName = this.emailOrUsernameControl?.value;
    const passwordValue = this.passwordControl?.value;
    if (emailOrUserName && passwordValue) {
      const isEmail = emailOrUserName.includes('@');
      let authBody;
      if (isEmail) {
        authBody = { email: emailOrUserName };
      } else {
        authBody = { userName: emailOrUserName };
      }
      authBody = { ...authBody, password: passwordValue };
      this.userService.loginUser$(authBody).subscribe({
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
