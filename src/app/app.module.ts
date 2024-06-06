import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { CoreModule } from '../core/core.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SalesReportManagerComponent } from './sales-report-manager/sales-report-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    SalesReportManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    CoreModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
