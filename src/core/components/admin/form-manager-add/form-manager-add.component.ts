import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../app/services/user/user.service';
import { AuthService } from '../../../../app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface UserAdd {
  store_id: string;
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-form-manager-add',
  templateUrl: './form-manager-add.component.html',
  styleUrl: './form-manager-add.component.scss'
})

export class FormManagerAddComponent implements OnInit {
  storeId: any;
  storeName: any;
  selectedFile: File | null = null;
  
  manager: UserAdd = {
    store_id: '', 
    username: '',
    password: '',
    role: 'manager' // Asigna el rol de manager
    // Agrega otros campos necesarios para el nuevo usuario
  };

  constructor(
    private userService: UserService, // Inyecta el servicio UserService
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.storeId = params.get('storeId');
      
      if (this.storeId && this.authService.isValidUUID(this.storeId)) {
        this.manager.store_id = this.storeId;
      } else {
        console.error('Store ID is null or not a valid UUID');
      }
    });
  }

  onSubmit(): void {
    if (!this.storeId) {
      console.error('Store ID is null, cannot submit the form');
      return;
    }

    // Asegúrate de asignar el store_id al manager
    this.manager.store_id = this.storeId;
    console.log('Manager:', this.manager);
    this.userService.addUser(this.manager).subscribe(
      (response) => {
        console.log('Manager added successfully', response);
      },
      (error) => {
        console.error('Error adding manager', error);
      }
    );
  }
}