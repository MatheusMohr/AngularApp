import { inject, Injectable } from '@angular/core';
import { ProdutoModel } from '../models/produtoModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private baseApiUrl = 'http://localhost:8080/produtos';
  private produtos: ProdutoModel[] = [];

  listar(): Observable<ProdutoModel[]>{
    return this.http.get<ProdutoModel[]>(`${this.baseApiUrl}/listar`).pipe(catchError(this.handle));
  }

  adicionar(produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.post<ProdutoModel>(`${this.baseApiUrl}/salvar`, produto).pipe(catchError(this.handle));
  }

  remover(id: string): Observable<string> {
    return this.http.post<string>(`${this.baseApiUrl}/deletar/${id}`, {}).pipe(catchError(this.handle));
  }

  editar(id: string, produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.post<ProdutoModel>(`${this.baseApiUrl}/editar/${id}`, produto).pipe(catchError(this.handle));
  }

  private handle(err: HttpErrorResponse){
    const msg = err.error?.message || err.error?.erro || err.message || 'Erro inesperado';
    return throwError(() => new Error(msg));
  }
}
