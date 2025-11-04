import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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

export interface UserPayload {
  sub: string; // email
  roles: string[];
  iat: number;
  exp: number;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string; // email
  nomeCompleto: string;
  usuarioId: string;
  roles: string[];
  permissoes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/soilanalitycs/api';
  private tokenKey = 'authToken';

  private currentUserSubject: BehaviorSubject<UserPayload | null>;
  public currentUser: Observable<UserPayload | null>;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    const initialUser = token ? decodeToken(token) : null;
    this.currentUserSubject = new BehaviorSubject<UserPayload | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserPayload | null {
    return this.currentUserSubject.value;
  }

  login(credentials: {login: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('usuarioId', response.usuarioId);
          localStorage.setItem('email', response.username);
          localStorage.setItem('nomeCompleto', response.nomeCompleto);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('permissoes', JSON.stringify(response.permissoes));
          const user = decodeToken(response.token);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('email');
    localStorage.removeItem('nomeCompleto');
    localStorage.removeItem('roles');
    localStorage.removeItem('permissoes');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    const permissoes = this.getPermissions();
    return permissoes.includes(permission);
  }

  getRoles(): string[] {
    const rolesStr = localStorage.getItem('roles');
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  getPermissions(): string[] {
    const permissoesStr = localStorage.getItem('permissoes');
    return permissoesStr ? JSON.parse(permissoesStr) : [];
  }

  getUsuarioId(): string | null {
    return localStorage.getItem('usuarioId');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getNomeCompleto(): string | null {
    return localStorage.getItem('nomeCompleto');
  }
}
