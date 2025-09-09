import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Authentication/auth.service';

export const EmailValidationGuard: CanActivateFn = (route, state) => {  
  const router = inject(Router);
  const service = inject(AuthService);
  
  const mailExist = service.isValidationPhase();  

  if (!mailExist) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
