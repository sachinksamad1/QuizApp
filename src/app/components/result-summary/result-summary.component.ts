// src/app/components/result-summary/result-summary.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-result-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './result-summary.component.html',
  styleUrls: ['./result-summary.component.scss']
})
export class ResultSummaryComponent implements OnInit {
  @Input() totalQuestions: number = 0;
  @Input() correctAnswers: number = 0;
  @Input() incorrectAnswers: number = 0;
  @Input() skippedQuestions: number = 0;
  @Input() scorePercentage: number = 0;
  
  @Output() restartQuiz = new EventEmitter<boolean>();
  
  constructor() {}
  
  ngOnInit(): void {}
  
  getScoreColor(): string {
    if (this.scorePercentage >= 80) {
      return 'green';
    } else if (this.scorePercentage >= 60) {
      return 'orange';
    } else {
      return 'red';
    }
  }
  
  getFeedbackMessage(): string {
    if (this.scorePercentage >= 90) {
      return 'Excellent! You are an Angular expert!';
    } else if (this.scorePercentage >= 70) {
      return 'Great job! You have a solid understanding of Angular.';
    } else if (this.scorePercentage >= 50) {
      return 'Good effort! Keep learning to improve your Angular knowledge.';
    } else {
      return 'Keep practicing! Angular has a learning curve, but you will get there.';
    }
  }
  
  handleRestart(randomize: boolean): void {
    this.restartQuiz.emit(randomize);
  }
}