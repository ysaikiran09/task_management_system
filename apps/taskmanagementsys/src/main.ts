import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { TasksComponent, LoginComponent } from './app/components/';
import { authGuard, publicGuard } from './app/guards';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule),
        provideRouter([
      { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [publicGuard]
      },
      { 
        path: 'tasks', 
        component: TasksComponent,
        canActivate: [authGuard]
      },
      { path: '', redirectTo: '/tasks', pathMatch: 'full' },
      { path: '**', redirectTo: '/tasks' }
    ])
  ],
}).catch((err) => console.error(err));
