import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CoreModule } from '../core/core.module';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InventoryComponent } from './views/inventory/inventory.component';
import { SalesReportComponent } from './views/sales-report/sales-report.component';
import { SalesComponent } from './views/sales/sales.component';
import { StoresComponent } from './views/admin/stores/stores.component';
import { ManagersComponent } from './views/admin/managers/managers.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    InventoryComponent,
    SalesReportComponent,
    SalesComponent,
    StoresComponent,
    ManagersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
