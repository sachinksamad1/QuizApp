// src/app/services/quiz.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Question, QuizState } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly STORAGE_KEY = 'quiz_state';
  private questionsData: Question[] = [];
  
  private quizStateSubject = new BehaviorSubject<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    userAnswers: new Map<number, number>(),
    correctCount: 0,
    incorrectCount: 0,
    quizCompleted: false
  });
  
  quizState$ = this.quizStateSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadSavedState();
  }
  
  // Load questions from JSON file
  loadQuestions(): Observable<Question[]> {
    return this.http.get<{questions: Question[]}>('assets/data/questions.json').pipe(
      tap(data => {
        this.questionsData = data.questions.map(question => ({
          ...question,
          difficulty: question.difficulty && ['easy', 'medium', 'hard'].includes(question.difficulty) ? question.difficulty as 'easy' | 'medium' | 'hard' : 'easy'
        }));
        this.resetQuiz(false);
      }),
      catchError(error => {
        console.error('Error loading questions', error);
        return of({ questions: [] });
      }),
      map(data => data.questions)
    );
  }
  
  // Initialize with mock questions (for testing purposes)
  loadMockQuestions(): void {
    // Import questions from local JSON file
    import('../data/questions.json').then(data => {
      this.questionsData = data.questions.map(question => ({
        ...question,
        difficulty: ['easy', 'medium', 'hard'].includes(question.difficulty) 
          ? question.difficulty as 'easy' | 'medium' | 'hard' 
          : 'easy'
      }));
      this.resetQuiz(false);
    });
  }
  
  // Get current quiz state
  getCurrentState(): QuizState {
    return this.quizStateSubject.value;
  }
  
  // Get current question
  getCurrentQuestion(): Question | null {
    const state = this.getCurrentState();
    return state.questions[state.currentQuestionIndex] || null;
  }
  
  // Submit answer for current question
  submitAnswer(questionId: number, selectedOptionId: number): boolean {
    const state = this.getCurrentState();
    const question = state.questions.find(q => q.id === questionId);
    
    if (!question) return false;
    
    const selectedOption = question.options.find(o => o.id === selectedOptionId);
    if (!selectedOption) return false;
    
    const isCorrect = selectedOption.isCorrect;
    
    // Update state
    const userAnswers = new Map(state.userAnswers);
    userAnswers.set(questionId, selectedOptionId);
    
    this.quizStateSubject.next({
      ...state,
      userAnswers,
      correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
      incorrectCount: !isCorrect ? state.incorrectCount + 1 : state.incorrectCount
    });
    
    this.saveState();
    return isCorrect;
  }
  
  // Move to next question
  nextQuestion(): void {
    const state = this.getCurrentState();
    
    if (state.currentQuestionIndex < state.questions.length - 1) {
      this.quizStateSubject.next({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      });
      this.saveState();
    } else {
      this.completeQuiz();
    }
  }
  
  // Move to previous question
  previousQuestion(): void {
    const state = this.getCurrentState();
    
    if (state.currentQuestionIndex > 0) {
      this.quizStateSubject.next({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1
      });
      this.saveState();
    }
  }
  
  // Mark quiz as completed
  completeQuiz(): void {
    const state = this.getCurrentState();
    
    this.quizStateSubject.next({
      ...state,
      quizCompleted: true
    });
    
    this.saveState();
  }
  
  // Reset quiz state
  resetQuiz(randomize: boolean = false): void {
    let questions = [...this.questionsData];
    
    if (randomize) {
      questions = this.shuffleArray(questions);
    }
    
    this.quizStateSubject.next({
      currentQuestionIndex: 0,
      questions,
      userAnswers: new Map<number, number>(),
      correctCount: 0,
      incorrectCount: 0,
      quizCompleted: false
    });
    
    this.saveState();
  }
  
  // Get results summary
  getResults(): {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    scorePercentage: number;
  } {
    const state = this.getCurrentState();
    const totalQuestions = state.questions.length;
    const correctAnswers = state.correctCount;
    const incorrectAnswers = state.incorrectCount;
    const attemptedQuestions = state.userAnswers.size;
    const skippedQuestions = totalQuestions - attemptedQuestions;
    const scorePercentage = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;
    
    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      scorePercentage
    };
  }
  
  // Save current state to localStorage
  private saveState(): void {
    const state = this.getCurrentState();
    
    // Convert Map to Array for serialization
    const serializedState = {
      ...state,
      userAnswers: Array.from(state.userAnswers.entries())
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedState));
  }
  
  // Load saved state from localStorage
  private loadSavedState(): void {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        // Convert Array back to Map
        const userAnswers = new Map(parsed.userAnswers);
        
        this.quizStateSubject.next({
          ...parsed,
          userAnswers
        });
      } catch (error) {
        console.error('Error parsing saved quiz state', error);
        // If error occurs, reset the quiz
        this.resetQuiz();
      }
    }
  }
  
  // Helper function to shuffle array (Fisher-Yates algorithm)
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}