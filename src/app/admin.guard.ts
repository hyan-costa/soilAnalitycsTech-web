import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

// Função auxiliar para decodificar o token JWT de forma segura
function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Erro ao decodificar o token', e);
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    const token = this.authService.getToken();

    if (token) {
      const decodedToken = decodeToken(token);
      // O backend foi ajustado para incluir uma claim 'roles'
      const roles = decodedToken?.roles || [];
      if (roles.includes('ROLE_ADMIN')) {
        return true;
      }
    }

    // Se não for admin, redireciona para a página de login
    return this.router.parseUrl('/login');
  }
}
