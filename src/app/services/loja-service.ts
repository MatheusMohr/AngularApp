import { Injectable } from '@angular/core';
import { LojaModel } from '../models/lojaModel';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  private lojas: LojaModel[] = [
    { id: 1, nome: 'Loja do Zé' },
    { id: 2, nome: 'Casa das Ferramentas' },
    { id: 3, nome: 'Super Construção' }
  ];

  private nextId = 4;

  listar(): LojaModel[] {
    return [...this.lojas];
  }

  adicionar(nome: string): LojaModel {
    const nova: LojaModel = { id: this.nextId++, nome };
    this.lojas.push(nova);
    return nova;
  }

  remover(id: number): void {
    this.lojas = this.lojas.filter(l => l.id !== id);
  }
}
