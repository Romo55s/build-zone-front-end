import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    PanelMenuModule,
    ButtonModule,
    BadgeModule,
    MenuModule,
    AvatarModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
