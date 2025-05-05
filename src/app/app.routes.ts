// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: '**', redirectTo: '' }
];