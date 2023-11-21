import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ValidationService } from '../services/validationService/validation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private validationService: ValidationService
  ) {}
  canActivate(): boolean {
    if (this.validationService.validateLoginStatus()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
