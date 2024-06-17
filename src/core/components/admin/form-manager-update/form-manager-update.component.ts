import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RowToggler } from 'primeng/table';
import { UserService } from '../../../../app/services/user/user.service';

@Component({
  selector: 'app-form-manager-update',
  templateUrl: './form-manager-update.component.html',
  styleUrl: './form-manager-update.component.scss'
})
export class FormManagerUpdateComponent  implements OnInit{
  updateManagerForm!: FormGroup;
  storeId!: string;
  storeName: any;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService
  ) {
    this.updateManagerForm = this.fb.group({
      store_id: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del usuario de la ruta
    this.route.params.subscribe(params => {
      this.storeId = params['storeId'];

    })

    // Llamar al servicio para obtener la información del usuario
    this.user.getUserById(this.storeId).subscribe((data: any) => {
      // Verificar si se obtuvo la información correctamente
      if (data.success) {
        // Establecer los valores en el formulario
        this.updateManagerForm.patchValue({
          store_id: data.user.store_id,
          username: data.user.username,
          role: data.user.role
        });
      } else {
        // Manejar el caso en que no se pueda obtener la información del usuario
        console.error("Error al obtener la información del usuario");
      }
    });
  }
  

  onSubmit(): void {
  }
}
