import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/Authentication/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {  
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {      
      if (error.status === 401 || error.status === 0) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};