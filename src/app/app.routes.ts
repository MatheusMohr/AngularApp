import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LojaComponent } from './component/loja-component/loja-component';
import { ProdutoComponent } from './component/produto-component/produto-component';

export const routes: Routes = [
  { path: 'lojas', component: LojaComponent },
  { path: 'produtos', component: ProdutoComponent },
  { path: '', redirectTo: '/lojas', pathMatch: 'full' },
  { path: '**', redirectTo: '/lojas' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }