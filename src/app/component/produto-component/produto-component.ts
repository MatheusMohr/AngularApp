import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto-service';
import { ProdutoModel } from '../../models/produtoModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produto-component.html',
  styleUrls: ['./produto-component.css']
})
export class ProdutoComponent implements OnInit {

  private service = inject(ProdutoService);

  produtos: ProdutoModel[] = [];
  novoNome = '';
  novoPreco = '';
  novoDescricao = '';
  erro = '';
  sucesso = '';
  loading = false;
  produtoEmEdicao = '';

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.loading = true;
    this.service.listar().subscribe({
      next: p => { this.produtos = p; this.loading = false; },
      error: e => { this.erro = e.message; this.loading = false; }
    });
  }

  adicionar() {
    this.erro = '';
    const precoNum = Number(this.novoPreco);

    if (!this.novoNome.trim()) { this.erro = 'Informe um nome'; return; }
    if (!this.novoDescricao.trim()) { this.erro = 'Informe uma descrição'; return; }
    if (isNaN(precoNum) || precoNum < 0) { this.erro = 'Informe um preço válido'; return; }

    const payload: ProdutoModel = {
      id: '',
      nome: this.novoNome,
      descricao: this.novoDescricao,
      preco: precoNum
    };

    this.loading = true;
    this.service.adicionar(payload).subscribe({
      next: p => {
        this.sucesso = `Produto ${p.nome} salvo com sucesso!`;
        this.resetForm();
      },
      error: e => { this.erro = e.message || 'Falha ao salvar o produto.'; this.loading = false; }
    });
  }

  editar(produto: ProdutoModel) {
    this.erro = '';
    const precoNum = Number(this.novoPreco);

    if (!this.novoNome.trim()) { this.erro = 'Informe um nome'; return; }
    if (!this.novoDescricao.trim()) { this.erro = 'Informe uma descrição'; return; }
    if (isNaN(precoNum) || precoNum < 0) { this.erro = 'Informe um preço válido'; return; }

    const payload: ProdutoModel = {
      id: produto.id,
      nome: this.novoNome,
      descricao: this.novoDescricao,
      preco: precoNum
    };

    this.loading = true;
    this.service.editar(produto.id, payload).subscribe({
      next: p => {
        this.sucesso = `Produto ${p.nome} atualizado com sucesso!`;
        this.resetForm();
      },
      error: e => { this.erro = e.message || 'Falha ao atualizar o produto'; this.loading = false; }
    });
  }

  remover(id: string) {
    if (!confirm('Deseja realmente remover este produto?')) return;

    this.loading = true;
    this.service.remover(id).subscribe({
      next: () => {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.sucesso = 'Produto removido com sucesso';
        this.loading = false;
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: e => { this.erro = e.message || 'Erro ao remover produto'; this.loading = false; }
    });
  }

salvarEdicao(produto: ProdutoModel) {
  const precoNum = Number(this.novoPreco);
  if (!this.novoNome.trim()) { this.erro = 'Informe um nome'; return; }
  if (!this.novoDescricao.trim()) { this.erro = 'Informe uma descrição'; return; }
  if (isNaN(precoNum) || precoNum < 0) { this.erro = 'Informe um preço válido'; return; }

  const payload: ProdutoModel = {
    id: produto.id, 
    nome: this.novoNome, 
    descricao: this.novoDescricao, 
    preco: precoNum
  };

  this.loading = true;
  this.service.editar(produto.id, payload).subscribe({
    next: (p) => {
      this.sucesso = `Produto ${p.nome} atualizado com sucesso!`;
      this.loading = false;

      this.novoNome = '';
      this.novoDescricao = '';
      this.novoPreco = '';

      this.listar();
      setTimeout(() => this.sucesso = '', 3000);
    },
    error: (e) => {
      this.erro = e.message || 'Falha ao atualizar o produto';
      this.loading = false;
    }
  });
}

  resetForm() {
    this.novoNome = '';
    this.novoPreco = '';
    this.novoDescricao = '';
    this.listar();
    this.loading = false;
    setTimeout(() => this.sucesso = '', 3000);
  }
}
