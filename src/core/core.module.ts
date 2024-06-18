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
import { FormStoreAddComponent } from './components/admin/form-store-add/form-store-add.component';
import { FormStoreUpdateComponent } from './components/admin/form-store-update/form-store-update.component';



@NgModule({
  declarations: [
    TablesComponent,
    FormManagerAddComponent,
    FormManagerUpdateComponent,
    FormInventoryAddComponent,
    FormInventoryUpdateComponent,
    FormStoreAddComponent,
    FormStoreUpdateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }