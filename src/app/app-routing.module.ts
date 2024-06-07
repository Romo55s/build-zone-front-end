import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './app/views/login/login.component';
import { DashboardComponent } from './app/views/dashboard/dashboard.component';
// Importa todos los componentes que necesitas proteger

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // Añade todas las rutas protegidas aquí
  { path: '**', redirectTo: 'login' } // Ruta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
