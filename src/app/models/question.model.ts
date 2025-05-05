// src/app/models/question.model.ts

export interface Option {
    id: number;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    id: number;
    text: string;
    options: Option[];
    explanation?: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    questions: Question[];
    userAnswers: Map<number, number>; // questionId -> selectedOptionId
    correctCount: number;
    incorrectCount: number;
    quizCompleted: boolean;
    timeRemaining?: number;
  }