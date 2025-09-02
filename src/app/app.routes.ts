import { Routes } from '@angular/router';
import { ProdutoComponent } from './component/produto-component/produto-component';
import { HomeComponent } from './component/home-component/home-component';
import { LojaComponent } from './component/loja-component/loja-component';

export const routes: Routes = [
{path: 'loja', component: LojaComponent},
{path: 'produtos', component: ProdutoComponent},
{path: '', component: HomeComponent}

];
