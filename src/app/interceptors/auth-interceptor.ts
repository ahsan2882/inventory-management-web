import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../services/user/user.service'; // Import your authentication service
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 && error.error?.tokenInvalidated) {
          // Handle 403 error (Token invalid)
          this.userService.logoutUser(); // Call your logout method from userService
          this.router.navigate(['/login']);
        }
        return throwError(() => new Error(error.error?.message));
      }),
    );
  }
}
