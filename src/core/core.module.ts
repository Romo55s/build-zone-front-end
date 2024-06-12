import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './components/tables/tables.component';
import { FormManagerAddComponent } from './components/admin/form-manager-add/form-manager-add.component';
import { FormManagerUpdateComponent } from './components/admin/form-manager-update/form-manager-update.component';
import { FormInventoryAddComponent } from './components/admin/form-inventory-add/form-inventory-add.component';
import { FormInventoryUpdateComponent } from './components/admin/form-inventory-update/form-inventory-update.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FileUploadModule } from 'primeng/fileupload';



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
    FileUploadModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }