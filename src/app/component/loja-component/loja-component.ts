import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LojaService } from '../../services/loja-service';
import { LojaModel } from '../../models/lojaModel';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loja-component.html',
})
export class LojaComponent implements OnInit {
  private service = inject(LojaService);

  lojas: LojaModel[] = [];
  novaLoja: LojaModel = { nome: '' };
  itemEmEdicao: LojaModel | null = null;
  lojaSelecionada: LojaModel | null = null;

  loading = false;
  detalhesLoading = false;
  erro = '';
  sucesso = '';

  ngOnInit() {
    this.listarLojas();
  }

  listarLojas() {
    this.loading = true;
    this.clearMessages();
    this.service.listar().subscribe({
      next: (data: LojaModel[]) => this.handleSuccess(data),
      error: (err: Error) => this.handleError(err)
    });
  }

  selecionarLoja(lojaParaVer: LojaModel) {
    if (this.lojaSelecionada?.id === lojaParaVer.id) {
      this.lojaSelecionada = null;
      return;
    }

    this.detalhesLoading = true;
    this.lojaSelecionada = lojaParaVer;
    
    this.service.buscarPorId(lojaParaVer.id!).subscribe({
      next: (lojaComProdutos: LojaModel) => {
        this.lojaSelecionada = lojaComProdutos;
        this.detalhesLoading = false;
      },
      error: (err: Error) => {
        this.handleError(err, `Falha ao buscar produtos da loja ${lojaParaVer.nome}.`);
        this.lojaSelecionada = null; // Reseta a seleção em caso de erro
        this.detalhesLoading = false;
      }
    });
  }

  adicionarLoja() {
    this.clearMessages();
    if (!this.novaLoja.nome.trim()) {
      this.erro = 'O nome da loja é obrigatório.';
      return;
    }
    
    this.loading = true;
    this.service.adicionar(this.novaLoja).subscribe({
      next: (lojaSalva: LojaModel) => {
        this.showSuccess(`Loja "${lojaSalva.nome}" adicionada com sucesso.`);
        this.resetForm();
        this.listarLojas();
      },
      error: (err: Error) => this.handleError(err, 'Falha ao adicionar loja.')
    });
  }

  removerLoja(id: string) {
    if (!confirm('Tem certeza que deseja remover esta loja e todos os seus produtos?')) return;
    
    this.clearMessages();
    this.loading = true;
    this.service.remover(id).subscribe({
      next: (mensagem: string) => {
        this.showSuccess(mensagem);
        // Após remover, a loja selecionada pode não existir mais
        if(this.lojaSelecionada?.id === id) {
            this.lojaSelecionada = null;
        }
        this.listarLojas();
      },
      error: (err: Error) => this.handleError(err, 'Falha ao remover loja.')
    });
  }

  abrirModalEdicao(loja: LojaModel) {
    this.itemEmEdicao = { ...loja };
  }

  salvarEdicao() {
    if (!this.itemEmEdicao || !this.itemEmEdicao.id || !this.itemEmEdicao.nome.trim()) {
      this.erro = "Dados inválidos para edição.";
      return;
    }
    
    this.clearMessages();
    this.loading = true;
    this.service.editar(this.itemEmEdicao.id, this.itemEmEdicao).subscribe({
      next: (lojaEditada: LojaModel) => {
        this.showSuccess(`Loja "${lojaEditada.nome}" atualizada com sucesso.`);
        this.listarLojas();
      },
      error: (err: Error) => this.handleError(err, 'Falha ao salvar edição.')
    });
  }

  // --- Métodos Utilitários ---
  private handleSuccess(data: LojaModel[]) {
    this.lojas = data;
    this.loading = false;
  }
  
  private handleError(error: Error, fallbackMessage?: string) {
    this.erro = error.message || fallbackMessage || 'Ocorreu um erro inesperado.';
    this.loading = false;
  }
  
  private showSuccess(message: string) {
    this.sucesso = message;
    this.loading = false;
    setTimeout(() => this.sucesso = '', 4000);
  }
  
  private clearMessages() {
    this.erro = '';
    this.sucesso = '';
  }
  
  private resetForm() {
    this.novaLoja = { nome: '' };
  }
}