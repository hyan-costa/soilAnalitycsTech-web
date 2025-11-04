import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para tipar os dados da API
export interface Perfil {
  perfilId: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  laboratorioId?: string;
  laboratorioNome?: string;
}

export interface Laboratorio {
  laboratorioId: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  ativo: boolean;
}

export interface Cliente {
  clienteId: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  ativo: boolean;
  laboratorioId: string;
  laboratorioNome: string;
}

export interface User {
  usuarioId: string;
  email: string;
  nomeCompleto: string;
  ativo: boolean;
  perfilId: string;
  perfilNome: string;
  laboratorioId?: string;
  laboratorioNome?: string;
  clienteId?: string;
  clienteNome?: string;
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

  private apiUrl = 'http://localhost:8080/soilanalitycs/api/v1';

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

  getPerfis(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.apiUrl}/perfis`);
  }

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.apiUrl}/laboratorios`);
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/usuarios`, user);
  }
}
