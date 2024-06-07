// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'build-zone';

  constructor(public authService: AuthService) { }

  ngOnInit() {
    console.log(this.authService.isAuthenticated());
  }
}