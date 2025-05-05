// src/app/app.config.ts

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    { 
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, 
      useValue: { 
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      } 
    }
  ]
};