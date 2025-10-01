import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LojaModel } from '../models/lojaModel';
  
@Injectable({ providedIn: 'root' })
export class LojaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/loja';

  listar(): Observable<LojaModel[]> {
    return this.http.get<LojaModel[]>(`${this.apiUrl}/listar`).pipe(catchError(this.handleError));
  }

  buscarPorId(id: string): Observable<LojaModel> {
    // ATENÇÃO: Este método requer um endpoint no seu LojaController, como @GetMapping("/{id}")
    return this.http.get<LojaModel>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  adicionar(loja: LojaModel): Observable<LojaModel> {
    return this.http.post<LojaModel>(`${this.apiUrl}/salvar`, loja).pipe(catchError(this.handleError));
  }

  editar(id: string, loja: LojaModel): Observable<LojaModel> {
    return this.http.post<LojaModel>(`${this.apiUrl}/editar/${id}`, loja).pipe(catchError(this.handleError));
  }

  remover(id: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/apagar/${id}`, null, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    const msg = err.error?.message || err.error || err.message || 'Erro inesperado';
    return throwError(() => new Error(msg));
  }
}