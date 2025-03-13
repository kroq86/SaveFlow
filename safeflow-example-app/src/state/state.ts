/**
 * State interfaces for the Project Management System
 */
import {
  User,
  Project,
  Task,
  Comment,
  Activity
} from '../domain/models';

/**
 * Application state
 */
export interface AppState {
  auth: AuthState;
  users: UsersState;
  projects: ProjectsState;
  tasks: TasksState;
  comments: CommentsState;
  activities: ActivitiesState;
  ui: UIState;
}

/**
 * Authentication state
 */
export interface AuthState {
  currentUser?: User;
  isAuthenticated: boolean;
  token?: string;
  loading: boolean;
  error?: string;
}

/**
 * Users state
 */
export interface UsersState {
  users: User[];
  selectedUser?: User;
  loading: boolean;
  error?: string;
}

/**
 * Projects state
 */
export interface ProjectsState {
  projects: Project[];
  selectedProject?: Project;
  loading: boolean;
  error?: string;
}

/**
 * Tasks state
 */
export interface TasksState {
  tasks: Task[];
  selectedTask?: Task;
  loading: boolean;
  error?: string;
}

/**
 * Comments state
 */
export interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error?: string;
}

/**
 * Activities state
 */
export interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error?: string;
}

/**
 * UI state
 */
export interface UIState {
  sidebarOpen: boolean;
  currentView: string;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
} 