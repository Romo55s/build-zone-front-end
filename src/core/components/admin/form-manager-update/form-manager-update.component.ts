import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RowToggler } from 'primeng/table';
import { UserService } from '../../../../app/services/user/user.service';
import { TostifyService } from '../../../../app/services/tostify/tostify.service';

@Component({
  selector: 'app-form-manager-update',
  templateUrl: './form-manager-update.component.html',
  styleUrl: './form-manager-update.component.scss'
})
export class FormManagerUpdateComponent  implements OnInit{
  updateManagerForm!: FormGroup;
  storeId!: string;
  userId!: string;
  storeName: any;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private tostifyService: TostifyService
  ) {
    this.updateManagerForm = this.fb.group({
      store_id: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del usuario y la tienda de la ruta
    this.route.params.subscribe(params => {
      this.storeId = params['storeId'];
      this.userId = params['userId'];
    })
    
    // Llamar al servicio para obtener la información del usuario
    this.user.getUserById(this.userId).subscribe((response: any) => {
      if (response) {
        // Establecer los valores en el formulario
        this.updateManagerForm.patchValue({
          store_id: response.store_id,
          username: response.username,
          password: response.password,
          role: response.role
        });
      } else {
        // Manejar el caso en que no se pueda obtener la información del usuario
        console.error("Error al obtener la información del usuario");
      }
    });
  }
  
  onSubmit(): void {
    if (this.updateManagerForm.valid) {
      const userData = this.updateManagerForm.value;
      this.user.updateUser(this.userId, userData).subscribe(
        response => {
          console.log('User updated successfully', response);
          this.tostifyService.showSuccess('User updated successfully');
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        },
        error => {
          console.error('Error updating user', error);
          this.tostifyService.showError('Error updating user', error);
          // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
      );
    } else {
      console.error('Form is not valid');
      this.tostifyService.showError('Form is not valid');
      // Aquí puedes manejar el caso en que el formulario no sea válido, por ejemplo, mostrando un mensaje al usuario
    }
  }
}