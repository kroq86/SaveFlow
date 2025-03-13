/**
 * Domain models for the Project Management System
 */

/**
 * User role
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER'
}

/**
 * User model
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project status
 */
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Project model
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  managerId: string;
  teamMemberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task priority
 */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Task status
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE'
}

/**
 * Task model
 */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment model
 */
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Activity type
 */
export enum ActivityType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  USER_ASSIGNED = 'USER_ASSIGNED',
  USER_UNASSIGNED = 'USER_UNASSIGNED'
}

/**
 * Activity model
 */
export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  projectId?: string;
  taskId?: string;
  commentId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  tasksInProgress: number;
  tasksDone: number;
  upcomingDeadlines: Task[];
  recentActivities: Activity[];
} 