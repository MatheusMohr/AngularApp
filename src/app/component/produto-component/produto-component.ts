import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../services/produto-service';
import { LojaService } from '../../services/loja-service';

import { ProdutoModel } from '../../models/produtoModel';
import { LojaModel } from '../../models/lojaModel';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-component.html',
  styleUrl: './produto-component.css'
})
export class ProdutoComponent implements OnInit {

  private produtoService = inject(ProdutoService);
  private lojaService = inject(LojaService);

  produtos: ProdutoModel[] = [];
  lojas: LojaModel[] = [];

  novoNome = '';
  novoPreco: number | null = null;
  novoDescricao = '';
  novaLojaId: string = ''; // CORRIGIDO: Tipo alterado para string

  editarItem: ProdutoModel | null = null;
  
  erro = '';
  sucesso = '';
  loading = false;

  ngOnInit(){
    this.carregarProdutos();
    this.carregarLojas();
  }

  carregarProdutos(){
    this.loading = true;
    this.produtoService.listar().subscribe({
      next: (data: ProdutoModel[]) => {
        this.produtos = data;
        this.loading = false;
      },
      error: (e: Error) => this.tratarErro(e, 'Falha ao carregar produtos.')
    });
  }
  
  carregarLojas(){
    this.lojaService.listar().subscribe({
      next: (data: LojaModel[]) => this.lojas = data,
      error: (e: Error) => this.tratarErro(e, `Falha ao carregar empresas: ${e.message}`)
    });
  }

  adicionar(){
    this.erro = '';
    if (!this.novoNome.trim()) { this.erro = 'Informe o nome'; return; }
    if (!this.novaLojaId) { this.erro = 'Selecione uma empresa'; return; }
    if (!this.novoPreco || this.novoPreco <= 0) { this.erro = 'Preço inválido'; return; }
    
    const payload: ProdutoModel = {
      nome: this.novoNome,
      descricao: this.novoDescricao,
      preco: this.novoPreco,
      lojaId: this.novaLojaId
    };

    this.loading = true;
    this.produtoService.adicionar(payload).subscribe({
      next: (p: ProdutoModel) => {
        this.mostrarSucesso(`Produto ${p.nome} salvo com sucesso`);
        this.resetarFormulario();
        this.carregarProdutos();
      },
      error: (e: Error) => this.tratarErro(e, 'Falha ao salvar o produto.')
    });
  }
  
  remover(id: string){
    if (!confirm('Deseja realmente remover este produto?')) return;

    this.produtoService.remover(id).subscribe({
      next: () => {
        this.mostrarSucesso("Produto removido com sucesso.");
        this.carregarProdutos();
      },
      error: (e: Error) => this.tratarErro(e, 'Falha ao remover o produto.')
    });
  }

  abrirModalEdicao(produto: ProdutoModel){
    this.editarItem = { ...produto };
    if (produto.lojaModel && produto.lojaModel.id) {
      // Agora os tipos são compatíveis: string = string
      this.editarItem.lojaId = produto.lojaModel.id;
    }
  }

  salvarEdicao(){
    if (!this.editarItem || !this.editarItem.id || !this.editarItem.lojaId) {
      this.erro = "Dados inválidos para edição.";
      return;
    }
    
    this.loading = true;
    this.produtoService.editar(this.editarItem.id, this.editarItem).subscribe({
      next: () => {
        this.mostrarSucesso('Produto atualizado com sucesso');
        this.carregarProdutos();
        this.editarItem = null;
      },
      error: (e: Error) => this.tratarErro(e, 'Falha ao editar o produto.')
    });
  }

  private resetarFormulario() {
    this.novoNome = '';
    this.novoDescricao = '';
    this.novoPreco = null;
    this.novaLojaId = '';
  }
  
  private tratarErro(e: Error, msgPadrao: string){
    this.erro = e.message || msgPadrao;
    this.loading = false;
  }

  private mostrarSucesso(msg: string) {
    this.sucesso = msg;
    this.loading = false;
    setTimeout(() => this.sucesso = '', 3000);
  }
}
