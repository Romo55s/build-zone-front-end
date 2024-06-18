import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ViewsModule } from './views/views-module.module';
import { AuthGuard } from './services/guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideNgVibeToastify } from '@ng-vibe/toastify';
import { TostifyService } from './services/tostify/tostify.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    ViewsModule,
    FormsModule
  ],
  providers: [provideClientHydration(), provideAnimations(), AuthGuard, MessageService, provideNgVibeToastify(), TostifyService],
  bootstrap: [AppComponent],
})
export class AppModule {}