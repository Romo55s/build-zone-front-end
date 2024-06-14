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
import { AuthService } from '../services/auth/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TostifyService } from '../services/tostify/tostify.service';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    InventoryComponent,
    SalesComponent,
    SalesReportComponent,
    ManagersComponent,
    StoresComponent,
  ],
  providers: [AuthService, TostifyService, MessageService, ConfirmationService],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    CoreModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ContextMenuModule,
    OverlayPanelModule,
    DialogModule,
    ChartModule,
    CardModule,
    PanelMenuModule,
    BadgeModule,
    ConfirmDialogModule
  ],
})
export class ViewsModule {}
