import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component'
import { StockSearchComponent } from './component/stock-search/stock-search.component'
import {LogoutComponent} from './component/logout/logout.component'
const routes: Routes = [
  { path: '', redirectTo: '/stock/search', pathMatch: 'full' },
 // { path: 'dashboard', component: DashboardComponent },
  { path: 'stock/search', component: StockSearchComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
