import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para tipar os dados da API
export interface Role {
  id: number;
  name: string;
}

export interface User {
  usuarioId: string;
  email: string;
  nomeCompleto: string;
  ativo: boolean;
  roles: string[]; // Assumindo que o backend vai popular isso ou que será derivado do perfil
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page number
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  getUsers(page: number, size: number, sort: string = 'email,asc'): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<Page<User>>(`${this.apiUrl}/usuarios`, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/usuarios/${id}`);
  }

  updateUser(id: string, payload: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/usuarios`, user);
  }
}
