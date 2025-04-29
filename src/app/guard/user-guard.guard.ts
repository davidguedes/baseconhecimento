import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const userGuardGuard: CanActivateFn = (route, state) => {
  const hasUser = inject(UserService).getUser();
  const router = inject(Router);

  console.log(hasUser)
  if(!hasUser) {
    console.log('Sem usuário!');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
