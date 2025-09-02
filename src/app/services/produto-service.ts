import { Injectable } from '@angular/core';
import { ProdutoModel } from '../models/produtoModel';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtos: ProdutoModel[] = [
    {id: 1, nome: 'Martelo'},
    {id:2, nome: 'Prego'},
    {id: 3, nome:'Makita'},
  ];
  private nextId = 4;

  listar(): ProdutoModel[]{
    return [...this.produtos]
  }

  adicionar(nome: string): ProdutoModel{
    const novo: ProdutoModel = {id: this.nextId++, nome};
    this.produtos.push(novo);
    return novo;
  }

  remover(id: number): void{
    this.produtos = this.produtos.filter(p => p.id !== id);
  }


}
