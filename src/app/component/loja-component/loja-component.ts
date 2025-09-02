import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LojaService } from '../../services/loja-service';
import { LojaModel } from '../../models/lojaModel';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './loja-component.html',
  styleUrls: ['./loja-component.css']
})
export class LojaComponent implements OnInit {

  private service = inject(LojaService);

  lojas: LojaModel[] = [];
  novoNome = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.lojas = this.service.listar();
  }

  adicionar() {
    const nome = this.novoNome.trim();
    if (!nome) return;
    this.service.adicionar(nome);
    this.novoNome = '';
    this.carregar();
  }

  remover(id: number) {
    this.service.remover(id);
    this.carregar();
  }
}
