import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './components/tables/tables.component';
import { FormManagerAddComponent } from './components/admin/form-manager-add/form-manager-add.component';
import { FormManagerUpdateComponent } from './components/admin/form-manager-update/form-manager-update.component';
import { FormInventoryAddComponent } from './components/admin/form-inventory-add/form-inventory-add.component';
import { FormInventoryUpdateComponent } from './components/admin/form-inventory-update/form-inventory-update.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule



@NgModule({
  declarations: [
    TablesComponent,
    FormManagerAddComponent,
    FormManagerUpdateComponent,
    FormInventoryAddComponent,
    FormInventoryUpdateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }