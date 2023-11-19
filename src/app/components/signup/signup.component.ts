import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordMatchValidator } from 'src/app/validators/passwordMatch';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  usernameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
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
  constructor(private router: Router) {}

  ngOnInit(): void {
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
  }

  onSubmit() {
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
      // Handle form submission, e.g., send data to backend
      console.log(this.signupForm.value);
    } else {
      // Form is invalid, handle accordingly (display errors, etc.)
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
