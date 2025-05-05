// src/app/components/quiz/quiz.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { ResultSummaryComponent } from '../result-summary/result-summary.component';
import { Question, QuizState } from '../../models/question.model';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuestionCardComponent,
    ResultSummaryComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  // Quiz component properties
  currentQuestion: Question | null = null;
  quizState!: QuizState;
  isLoading: boolean = true;
  showFeedback: boolean = false;
  isAnswerCorrect: boolean | null = null;
  selectedOptionId: number | null = null;
  
  // Optional timer feature
  timerEnabled: boolean = false;
  timePerQuestion: number = 30; // seconds
  timeRemaining: number = 0;
  timerSubscription?: Subscription;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    public quizService: QuizService,
    public snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Load quiz questions
    this.loadQuiz();
    
    // Subscribe to quiz state changes
    this.quizService.quizState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.quizState = state;
        this.currentQuestion = this.quizService.getCurrentQuestion();
        
        // Check if there's already an answer for this question
        if (this.currentQuestion) {
          const existingAnswer = state.userAnswers.get(this.currentQuestion.id);
          if (existingAnswer !== undefined) {
            this.selectedOptionId = existingAnswer;
            this.showFeedback = true;
            this.checkAnswer(existingAnswer);
          } else {
            this.selectedOptionId = null;
            this.showFeedback = false;
            this.isAnswerCorrect = null;
          }
        }
        
        // If quiz is completed, stop the timer
        if (state.quizCompleted && this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  
  loadQuiz(): void {
    this.isLoading = true;
    
    try {
      // Try to load from API first
      this.quizService.loadQuestions().subscribe({
        next: () => {
          this.isLoading = false;
          if (this.timerEnabled) {
            this.startTimer();
          }
        },
        error: () => {
          // Fallback to mock data if API fails
          this.quizService.loadMockQuestions();
          this.isLoading = false;
          if (this.timerEnabled) {
            this.startTimer();
          }
        }
      });
    } catch (error) {
      console.error('Error loading quiz:', error);
      this.snackBar.open('Failed to load quiz questions. Please try again.', 'Close', {
        duration: 5000
      });
      this.isLoading = false;
    }
  }
  
  handleOptionSelected(optionId: number): void {
    if (!this.currentQuestion || this.showFeedback) {
      return;
    }
    
    this.selectedOptionId = optionId;
    this.isAnswerCorrect = this.quizService.submitAnswer(this.currentQuestion.id, optionId);
    this.showFeedback = true;
    
    // Stop the timer when an answer is selected
    if (this.timerEnabled && this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  
  checkAnswer(optionId: number): boolean {
    if (!this.currentQuestion) return false;
    
    const option = this.currentQuestion.options.find(o => o.id === optionId);
    this.isAnswerCorrect = option?.isCorrect || false;
    return this.isAnswerCorrect;
  }
  
  handleNextQuestion(): void {
    this.showFeedback = false;
    this.selectedOptionId = null;
    this.isAnswerCorrect = null;
    this.quizService.nextQuestion();
    
    // Restart timer for next question
    if (this.timerEnabled) {
      this.startTimer();
    }
  }
  
  handleRestartQuiz(randomize: boolean): void {
    this.quizService.resetQuiz(randomize);
    
    this.snackBar.open(`Quiz restarted ${randomize ? 'with randomized questions' : ''}`, 'Close', {
      duration: 3000
    });
    
    // Restart timer if enabled
    if (this.timerEnabled) {
      this.startTimer();
    }
  }
  
  toggleTimer(): void {
    this.timerEnabled = !this.timerEnabled;
    
    if (this.timerEnabled) {
      this.startTimer();
    } else if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    this.snackBar.open(`Timer ${this.timerEnabled ? 'enabled' : 'disabled'}`, 'Close', {
      duration: 2000
    });
  }
  
  startTimer(): void {
    // Cancel any existing timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    this.timeRemaining = this.timePerQuestion;
    
    this.timerSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeRemaining--;
        
        if (this.timeRemaining <= 0) {
          // Time's up! Auto-submit if no answer selected
          if (!this.showFeedback && this.currentQuestion) {
            this.snackBar.open('Time\'s up! Moving to next question.', 'Close', {
              duration: 3000
            });
            
            // If no answer selected, count as skipped
            if (this.selectedOptionId === null) {
              this.handleNextQuestion();
            }
          }
        }
      });
  }
  
  getTimerProgressValue(): number {
    return (this.timeRemaining / this.timePerQuestion) * 100;
  }
  
  getTimerColor(): string {
    if (this.timeRemaining > this.timePerQuestion * 0.6) {
      return 'primary';
    } else if (this.timeRemaining > this.timePerQuestion * 0.3) {
      return 'accent';
    } else {
      return 'warn';
    }
  }
}