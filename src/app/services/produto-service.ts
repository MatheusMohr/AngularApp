import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ProdutoModel } from '../models/produtoModel';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/produtos';

  listar(): Observable<ProdutoModel[]> {
    return this.http.get<ProdutoModel[]>(`${this.apiUrl}/listar`).pipe(catchError(this.handleError));
  }

  adicionar(produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.post<ProdutoModel>(`${this.apiUrl}/salvar`, produto).pipe(catchError(this.handleError));
  }

  editar(id: string, produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.post<ProdutoModel>(`${this.apiUrl}/editar/${id}`, produto).pipe(catchError(this.handleError));
  }

  remover(id: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/apagar/${id}`, null, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    const msg = err.error?.message || err.error || err.message || 'Erro inesperado';
    return throwError(() => new Error(msg));
  }
}