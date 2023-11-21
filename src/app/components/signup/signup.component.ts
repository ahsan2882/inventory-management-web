import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import {
  SignUpResponse,
  ValidationCodeResponse,
} from 'src/app/models/login/login.model';
import { UserData } from 'src/app/models/user/user.model';
import { ValidationService } from 'src/app/services/validationService/validation.service';
import { UserService } from 'src/app/services/user/user.service';
import { PasswordMatchValidator } from 'src/app/validators/passwordMatch';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  showCodeInput: boolean = false;
  userData!: UserData;

  codeValidationForm!: FormGroup;
  signupForm!: FormGroup;
  usernameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(/^[\w\.-]+@[\w\.-]+\.\w{2,4}$/),
  ]);
  passwordControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(40),
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$/
    ),
  ]);
  confirmPasswordControl: FormControl = new FormControl('', [
    Validators.required,
  ]);
  fullNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  validationCodeControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{8}$'),
  ]);

  constructor(
    private router: Router,
    private validationService: ValidationService,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    if (this.validationService.validateLoginStatus()) {
      this.router.navigate(['/home']);
    }
    this.signupForm = new FormGroup(
      {
        username: this.usernameControl,
        email: this.emailControl,
        fullName: this.fullNameControl,
        password: this.passwordControl,
        confirmPassword: this.confirmPasswordControl,
      },
      [PasswordMatchValidator.match('password', 'confirmPassword')]
    );
    this.codeValidationForm = new FormGroup(
      {
        codeControl: this.validationCodeControl,
      },
      []
    );
    this.subscriptions.add(
      this.signupForm
        .get('username')!
        .valueChanges.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap((value: string) => {
            if (value.trim().length >= 6) {
              return of(value.trim());
            }
            return of();
          }),
          switchMap((value: string) => {
            return this.userService.checkUserNameAvailability$(value);
          })
        )
        .subscribe((value) => {
          if (value.exists) {
            this.usernameControl.setErrors({ unavailable: true });
          } else {
            this.usernameControl.setErrors(null);
          }
        })
    );
    this.subscriptions.add(
      this.signupForm
        .get('email')!
        .valueChanges.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap((value: string) => {
            if (this.signupForm.get('email')!.valid) {
              return of(value.trim());
            } else {
              return of();
            }
          }),
          switchMap((value: string) => {
            return this.userService.checkEmailAvailability$(value);
          })
        )
        .subscribe((value) => {
          if (value.exists) {
            this.emailControl.setErrors({ unavailable: true });
          } else {
            this.emailControl.setErrors(null);
          }
        })
    );
  }

  validateCode() {
    const enteredCode: string =
      this.codeValidationForm.get('codeControl')!.value;
    this.validationService
      .validateCode$(enteredCode, this.userData.email)
      .pipe(
        switchMap((res: ValidationCodeResponse) => {
          if (res.validated) {
            this.validationCodeControl.setErrors(null);
            return this.userService.signUpUser$(this.userData);
          } else {
            this.validationCodeControl.setErrors({ invalidCode: true });
            if (res.expired) {
              this.validationCodeControl.setErrors({ expired: true });
              this.resendValidationCode();
            }
            return of();
          }
        })
      )
      .subscribe((res: SignUpResponse) => {
        if (res.token) {
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        }
      });
  }

  onSignupSubmit() {
    this.signupForm.markAllAsTouched();
    const usernameValue = this.signupForm.get('username')!.value.trim();
    const fullnameValue = this.signupForm.get('fullName')!.value.trim();
    const emailValue = this.signupForm.get('email')!.value.trim();
    // Update form values with trimmed values
    this.signupForm.patchValue({
      username: usernameValue,
      fullName: fullnameValue,
      email: emailValue,
    });
    if (this.signupForm.valid) {
      this.userData = {
        email: emailValue,
        fullName: fullnameValue,
        userName: usernameValue,
        password: this.signupForm.get('password')!.value,
      };
      // Handle form submission, e.g., send data to backend
      this.validationService
        .sendEmailForValidation$(this.userData.email, this.userData.fullName)
        .subscribe((res) => {
          if (res?.sentEmail) {
            this.showCodeInput = true;
          }
        });
    } else {
      // Form is invalid, handle accordingly (display errors, etc.)
    }
  }

  resendValidationCode(): void {
    this.validationService
      .sendEmailForValidation$(this.userData.email, this.userData.fullName)
      .subscribe((res) => {
        if (res?.sentEmail) {
          this.showCodeInput = true;
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
