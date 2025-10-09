import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Esto NO es una clase, es una funcion, todo lo que estan en el codigo se va a ejecutar.
export const rolGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.obtenerUsuario();

  if (!usuario) {
    router.navigate(['']);
    return false;
  }

  const rolesPermitidos = route.data['roles'] as string[];

  if (rolesPermitidos.includes(usuario.rol)) {
    return true;
  }

  router.navigate(['']);
  return false;
};
