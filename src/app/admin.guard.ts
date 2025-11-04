import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    // Verifica se o usuário está autenticado e tem o role ADMIN
    if (this.authService.isAuthenticated() && this.authService.hasRole('ROLE_ADMIN')) {
      return true;
    }

    // Se não for admin, redireciona para a página de login
    return this.router.parseUrl('/login');
  }
}
