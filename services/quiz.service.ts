import { api } from '@/config/api';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions_count: number;
  time_limit?: number;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_points: number;
  percentage: number;
  started_at: string;
  completed_at: string;
}

export interface SubmitAnswerRequest {
  question_id: string;
  selected_option: number;
}

export const quizService = {
  /**
   * Get all available quizzes
   * FastAPI endpoint: GET /api/quizzes
   */
  getAllQuizzes: async (): Promise<Quiz[]> => {
    return api.get<Quiz[]>('/api/quizzes');
  },

  /**
   * Get quiz by ID
   * FastAPI endpoint: GET /api/quizzes/:id
   */
  getQuizById: async (quizId: string): Promise<Quiz> => {
    return api.get<Quiz>(`/api/quizzes/${quizId}`);
  },

  /**
   * Get questions for a quiz
   * FastAPI endpoint: GET /api/quizzes/:id/questions
   */
  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    return api.get<Question[]>(`/api/quizzes/${quizId}/questions`);
  },

  /**
   * Start a quiz attempt
   * FastAPI endpoint: POST /api/quizzes/:id/start
   */
  startQuiz: async (quizId: string): Promise<{ attempt_id: string }> => {
    return api.post<{ attempt_id: string }>(`/api/quizzes/${quizId}/start`);
  },

  /**
   * Submit answer for a question
   * FastAPI endpoint: POST /api/quiz-attempts/:attemptId/answer
   */
  submitAnswer: async (attemptId: string, answer: SubmitAnswerRequest): Promise<{ correct: boolean }> => {
    return api.post<{ correct: boolean }>(`/api/quiz-attempts/${attemptId}/answer`, answer);
  },

  /**
   * Complete quiz attempt
   * FastAPI endpoint: POST /api/quiz-attempts/:attemptId/complete
   */
  completeQuiz: async (attemptId: string): Promise<QuizAttempt> => {
    return api.post<QuizAttempt>(`/api/quiz-attempts/${attemptId}/complete`);
  },

  /**
   * Get user's quiz history
   * FastAPI endpoint: GET /api/users/me/quiz-attempts
   */
  getUserQuizAttempts: async (): Promise<QuizAttempt[]> => {
    return api.get<QuizAttempt[]>('/api/users/me/quiz-attempts');
  },
};
