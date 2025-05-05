// src/app/components/question-card/question-card.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../models/question.model';
import { MatRadioChange } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnInit {
  @Input() question!: Question;
  @Input() currentIndex: number = 0;
  @Input() totalQuestions: number = 0;
  @Input() selectedOptionId: number | null = null;
  @Input() showFeedback: boolean = false;
  @Input() isAnswerCorrect: boolean | null = null;
  
  @Output() optionSelected = new EventEmitter<number>();
  @Output() nextQuestion = new EventEmitter<void>();
  
  progressValue: number = 0;
  
  constructor() {}
  
  ngOnInit(): void {
    this.updateProgress();
  }
  
  ngOnChanges(): void {
    this.updateProgress();
  }
  
  updateProgress(): void {
    this.progressValue = this.totalQuestions > 0
      ? ((this.currentIndex + 1) / this.totalQuestions) * 100
      : 0;
  }
  
  handleOptionChange(event: MatRadioChange): void {
    this.optionSelected.emit(event.value);
  }
  
  getOptionClass(optionId: number): string {
    if (!this.showFeedback || this.selectedOptionId !== optionId) {
      return '';
    }
    
    const option = this.question.options.find(o => o.id === optionId);
    return option?.isCorrect ? 'correct-answer' : 'incorrect-answer';
  }
  
  getDifficultyColor(): string {
    switch (this.question.difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'primary';
    }
  }
}