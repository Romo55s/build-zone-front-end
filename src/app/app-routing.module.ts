import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { SalesReportComponent } from './views/sales-report/sales-report.component';
import { SalesComponent } from './views/sales/sales.component';
import { ManagersComponent } from './views/admin/managers/managers.component';
import { FormInventoryAddComponent } from '../core/components/admin/form-inventory-add/form-inventory-add.component';
import { FormInventoryUpdateComponent } from '../core/components/admin/form-inventory-update/form-inventory-update.component';
import { FormManagerAddComponent } from '../core/components/admin/form-manager-add/form-manager-add.component';
import { FormManagerUpdateComponent } from '../core/components/admin/form-manager-update/form-manager-update.component';
import { StoresComponent } from './views/admin/stores/stores.component';
import { FormStoreAddComponent } from '../core/components/admin/form-store-add/form-store-add.component';
import { FormStoreUpdateComponent } from '../core/components/admin/form-store-update/form-store-update.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'inventory/:storeName', component: InventoryComponent, canActivate: [AuthGuard] }, 
  { path: 'report', component: SalesReportComponent, canActivate: [AuthGuard] },
  { path: 'report/:storeName', component: SalesReportComponent, canActivate: [AuthGuard] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard]},
  { path: 'sales/:storeName', component: SalesComponent, canActivate: [AuthGuard]},
  { path: 'managers', component: ManagersComponent, canActivate: [AuthGuard]},
  { path: 'managers/:storeName', component: ManagersComponent, canActivate: [AuthGuard]},
  { path: 'stores', component: StoresComponent, canActivate: [AuthGuard]},
  { path: 'addStore', component: FormStoreAddComponent, canActivate: [AuthGuard]},
  { path: 'updateStore/:id', component: FormStoreUpdateComponent, canActivate: [AuthGuard]},
  { path: 'stores/:storeName', component: StoresComponent, canActivate: [AuthGuard]},
  { path: 'addProduct', component: FormInventoryAddComponent, canActivate: [AuthGuard]},
  { path: 'updateProduct', component: FormInventoryUpdateComponent, canActivate: [AuthGuard]}, 
  { path: 'addManager', component: FormManagerAddComponent, canActivate: [AuthGuard]},
  { path: 'updateManager', component: FormManagerUpdateComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }