import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LojaComponent } from './component/loja-component/loja-component';
import { ProdutoComponent } from './component/produto-component/produto-component';
import { HomeComponent } from './component/home-component/home-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },   // raiz vai para home
  { path: 'home', component: HomeComponent },            // rota home
  { path: 'lojas', component: LojaComponent },           // rota lojas
  { path: 'produtos', component: ProdutoComponent },     // rota produtos
  { path: '**', redirectTo: '/home' }                    // curinga sempre por último
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
