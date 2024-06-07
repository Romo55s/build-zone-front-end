import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { ManagersComponent } from './admin/managers/managers.component';
import { StoresComponent } from './admin/stores/stores.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    InventoryComponent,
    SalesComponent,
    SalesReportComponent,
    ManagersComponent,
    StoresComponent
  ],
  providers: [AuthService],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule
  ]
})
export class ViewsModule { }