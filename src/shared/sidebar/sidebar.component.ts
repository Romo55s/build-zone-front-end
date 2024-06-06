import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  options = ['build-zone-mty', 'build-zone-gdl', 'build-zone-ags', 'build-zone-cdmx']; // Tus opciones aquí
  
    showOptions = false;
  
    toggleOptions() {
      this.showOptions = !this.showOptions;
    }
}
