import { api } from '@/config/api';
import { Question, Quiz } from './quiz.service';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  is_active: boolean;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
}

export interface CreateQuestionRequest {
  question_text: string;
  options: string[];
  correct_answer: number;
  points: number;
}

export interface AdminStats {
  total_users: number;
  total_quizzes: number;
  total_attempts: number;
  active_users_today: number;
}

export const adminService = {
  /**
   * Get all users (admin only)
   * FastAPI endpoint: GET /api/admin/users
   */
  getAllUsers: async (): Promise<User[]> => {
    return api.get<User[]>('/api/admin/users');
  },

  /**
   * Update user status (admin only)
   * FastAPI endpoint: PATCH /api/admin/users/:userId
   */
  updateUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    return api.patch<User>(`/api/admin/users/${userId}`, { is_active: isActive });
  },

  /**
   * Delete user (admin only)
   * FastAPI endpoint: DELETE /api/admin/users/:userId
   */
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/admin/users/${userId}`);
  },

  /**
   * Create new quiz (admin only)
   * FastAPI endpoint: POST /api/admin/quizzes
   */
  createQuiz: async (quizData: CreateQuizRequest): Promise<Quiz> => {
    return api.post<Quiz>('/api/admin/quizzes', quizData);
  },

  /**
   * Update quiz (admin only)
   * FastAPI endpoint: PUT /api/admin/quizzes/:quizId
   */
  updateQuiz: async (quizId: string, quizData: Partial<CreateQuizRequest>): Promise<Quiz> => {
    return api.put<Quiz>(`/api/admin/quizzes/${quizId}`, quizData);
  },

  /**
   * Delete quiz (admin only)
   * FastAPI endpoint: DELETE /api/admin/quizzes/:quizId
   */
  deleteQuiz: async (quizId: string): Promise<void> => {
    await api.delete(`/api/admin/quizzes/${quizId}`);
  },

  /**
   * Add question to quiz (admin only)
   * FastAPI endpoint: POST /api/admin/quizzes/:quizId/questions
   */
  addQuestion: async (quizId: string, questionData: CreateQuestionRequest): Promise<Question> => {
    return api.post<Question>(`/api/admin/quizzes/${quizId}/questions`, questionData);
  },

  /**
   * Update question (admin only)
   * FastAPI endpoint: PUT /api/admin/questions/:questionId
   */
  updateQuestion: async (questionId: string, questionData: Partial<CreateQuestionRequest>): Promise<Question> => {
    return api.put<Question>(`/api/admin/questions/${questionId}`, questionData);
  },

  /**
   * Delete question (admin only)
   * FastAPI endpoint: DELETE /api/admin/questions/:questionId
   */
  deleteQuestion: async (questionId: string): Promise<void> => {
    await api.delete(`/api/admin/questions/${questionId}`);
  },

  /**
   * Get admin dashboard stats
   * FastAPI endpoint: GET /api/admin/stats
   */
  getAdminStats: async (): Promise<AdminStats> => {
    return api.get<AdminStats>('/api/admin/stats');
  },
};
