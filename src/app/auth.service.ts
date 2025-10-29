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
  sub: string; // login
  roles: string[];
  login: string;
  fullName: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';
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

  login(credentials: {login: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('login', response.username);
          localStorage.setItem('fullName', response.nomeCompleto);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          const user = decodeToken(response.token);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
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
    return this.currentUserValue?.roles?.includes(role) ?? false;
  }
}
