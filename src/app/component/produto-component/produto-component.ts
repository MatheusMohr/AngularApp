import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produto-component.html',
  styleUrl: './produto-component.css'
})
export class ProdutoComponent implements OnInit {

  private service = inject(ProdutoService);

  produtos: ProdutoModel[]=[];
  novoNome = '';
  novoPreco = '';
  novoDescricao = '';
  erro = '';

  loading = false;


  ngOnInit(){
    this.listar();
  }

  listar(){
    this.loading = true;
    this.service.listar()
        //Faz a inscrição para reagir ao resultado do Observable
        .subscribe({
          next: p => {
            this.produtos = p;
            this.loading = false;
          },
          error: e => {
            this.erro = e.message;
            this.loading = false;
          }
        })
  }

/* 
  adicionar(){
    const nome= this.novoNome.trim();
    if(!nome) return;
    this.service.adicionar(nome);
    this.novoNome ='';
    this.carregar();
  }

  remover(id: number){
    this.service.remover(id);
    this.carregar();
  } */

}
