/**
 * Store implementation using SafeFlow Reactive System
 */
import { SafeFlowStore, TransactionalClass, Transactional } from 'safeflow-reactive';
import { v4 as uuidv4 } from 'uuid';

import type {
  User,
  Project,
  Task,
  Comment,
  Activity
} from '../domain/models';
import {
  UserRole,
  TaskPriority,
  ActivityType,
  ProjectStatus,
  TaskStatus
} from '../domain/models';
import type {
  AppState,
  AuthState,
  UsersState,
  ProjectsState,
  TasksState,
  CommentsState,
  ActivitiesState,
  UIState,
  Notification
} from './state';

// Initial state
const initialAuthState: AuthState = {
  isAuthenticated: false,
  loading: false
};

const initialUsersState: UsersState = {
  users: [],
  loading: false
};

const initialProjectsState: ProjectsState = {
  projects: [],
  loading: false
};

const initialTasksState: TasksState = {
  tasks: [],
  loading: false
};

const initialCommentsState: CommentsState = {
  comments: [],
  loading: false
};

const initialActivitiesState: ActivitiesState = {
  activities: [],
  loading: false
};

const initialUIState: UIState = {
  sidebarOpen: true,
  currentView: 'dashboard',
  theme: 'light',
  notifications: []
};

// Initial app state
const initialAppState: AppState = {
  auth: initialAuthState,
  users: initialUsersState,
  projects: initialProjectsState,
  tasks: initialTasksState,
  comments: initialCommentsState,
  activities: initialActivitiesState,
  ui: initialUIState
};

// Create the store
const appStore = new SafeFlowStore<AppState>(initialAppState);

/**
 * App Store Service
 */
@TransactionalClass()
export class AppStoreService {
  /**
   * Get the current state
   */
  getState(): AppState {
    return appStore.getState();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(
    callback: (state: AppState) => void,
    errorCallback?: (error: any) => void,
    completeCallback?: () => void
  ) {
    return appStore.subscribe(callback, errorCallback, completeCallback);
  }

  // Auth actions
  @Transactional()
  login(user: User, token: string): void {
    appStore.setState({
      auth: {
        ...appStore.getState().auth,
        currentUser: user,
        isAuthenticated: true,
        token,
        loading: false,
        error: undefined
      }
    });

    this.addNotification({
      type: 'success',
      message: `Welcome back, ${user.firstName}!`
    });
  }

  @Transactional()
  logout(): void {
    appStore.setState({
      auth: {
        ...appStore.getState().auth,
        currentUser: undefined,
        isAuthenticated: false,
        token: undefined
      }
    });

    this.addNotification({
      type: 'info',
      message: 'You have been logged out.'
    });
  }

  @Transactional()
  setAuthLoading(loading: boolean): void {
    appStore.setState({
      auth: {
        ...appStore.getState().auth,
        loading
      }
    });
  }

  @Transactional()
  setAuthError(error: string): void {
    appStore.setState({
      auth: {
        ...appStore.getState().auth,
        error,
        loading: false
      }
    });

    this.addNotification({
      type: 'error',
      message: `Authentication error: ${error}`
    });
  }

  // User actions
  @Transactional()
  setUsers(users: User[]): void {
    appStore.setState({
      users: {
        ...appStore.getState().users,
        users,
        loading: false
      }
    });
  }

  @Transactional()
  addUser(user: User): void {
    const state = appStore.getState();
    appStore.setState({
      users: {
        ...state.users,
        users: [...state.users.users, user]
      }
    });

    this.addNotification({
      type: 'success',
      message: `User ${user.username} has been added.`
    });
  }

  @Transactional()
  updateUser(user: User): void {
    const state = appStore.getState();
    appStore.setState({
      users: {
        ...state.users,
        users: state.users.users.map((u: User) => u.id === user.id ? user : u)
      }
    });

    this.addNotification({
      type: 'success',
      message: `User ${user.username} has been updated.`
    });
  }

  @Transactional()
  deleteUser(userId: string): void {
    const state = appStore.getState();
    const user = state.users.users.find((u: User) => u.id === userId);
    
    if (!user) {
      this.addNotification({
        type: 'error',
        message: `User not found.`
      });
      return;
    }

    appStore.setState({
      users: {
        ...state.users,
        users: state.users.users.filter((u: User) => u.id !== userId)
      }
    });

    this.addNotification({
      type: 'success',
      message: `User ${user.username} has been deleted.`
    });
  }

  @Transactional()
  selectUser(userId: string): void {
    const state = appStore.getState();
    const selectedUser = state.users.users.find((u: User) => u.id === userId);
    
    appStore.setState({
      users: {
        ...state.users,
        selectedUser
      }
    });
  }

  // Project actions
  @Transactional()
  setProjects(projects: Project[]): void {
    appStore.setState({
      projects: {
        ...appStore.getState().projects,
        projects,
        loading: false
      }
    });
  }

  @Transactional()
  addProject(project: Project): void {
    const state = appStore.getState();
    appStore.setState({
      projects: {
        ...state.projects,
        projects: [...state.projects.projects, project]
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.PROJECT_CREATED,
      userId: state.auth.currentUser?.id || '',
      projectId: project.id,
      createdAt: new Date()
    });

    this.addNotification({
      type: 'success',
      message: `Project "${project.name}" has been created.`
    });
  }

  @Transactional()
  updateProject(project: Project): void {
    const state = appStore.getState();
    appStore.setState({
      projects: {
        ...state.projects,
        projects: state.projects.projects.map((p: Project) => p.id === project.id ? project : p)
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.PROJECT_UPDATED,
      userId: state.auth.currentUser?.id || '',
      projectId: project.id,
      createdAt: new Date()
    });

    this.addNotification({
      type: 'success',
      message: `Project "${project.name}" has been updated.`
    });
  }

  @Transactional()
  deleteProject(projectId: string): void {
    const state = appStore.getState();
    const project = state.projects.projects.find((p: Project) => p.id === projectId);
    
    if (!project) {
      this.addNotification({
        type: 'error',
        message: `Project not found.`
      });
      return;
    }

    appStore.setState({
      projects: {
        ...state.projects,
        projects: state.projects.projects.filter((p: Project) => p.id !== projectId)
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.PROJECT_DELETED,
      userId: state.auth.currentUser?.id || '',
      projectId: projectId,
      createdAt: new Date()
    });

    this.addNotification({
      type: 'success',
      message: `Project "${project.name}" has been deleted.`
    });
  }

  @Transactional()
  selectProject(projectId: string): void {
    const state = appStore.getState();
    const selectedProject = state.projects.projects.find((p: Project) => p.id === projectId);
    
    appStore.setState({
      projects: {
        ...state.projects,
        selectedProject
      }
    });
  }

  // Task actions
  @Transactional()
  setTasks(tasks: Task[]): void {
    appStore.setState({
      tasks: {
        ...appStore.getState().tasks,
        tasks,
        loading: false
      }
    });
  }

  @Transactional()
  addTask(task: Task): void {
    const state = appStore.getState();
    appStore.setState({
      tasks: {
        ...state.tasks,
        tasks: [...state.tasks.tasks, task]
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.TASK_CREATED,
      userId: state.auth.currentUser?.id || '',
      projectId: task.projectId,
      taskId: task.id,
      createdAt: new Date()
    });

    this.addNotification({
      type: 'success',
      message: `Task "${task.title}" has been created.`
    });
  }

  @Transactional()
  updateTask(task: Task): void {
    const state = appStore.getState();
    const oldTask = state.tasks.tasks.find((t: Task) => t.id === task.id);
    
    appStore.setState({
      tasks: {
        ...state.tasks,
        tasks: state.tasks.tasks.map((t: Task) => t.id === task.id ? task : t)
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.TASK_UPDATED,
      userId: state.auth.currentUser?.id || '',
      projectId: task.projectId,
      taskId: task.id,
      createdAt: new Date()
    });

    // If assignee changed, add assignment activity
    if (oldTask && oldTask.assigneeId !== task.assigneeId) {
      if (task.assigneeId) {
        this.addActivity({
          id: uuidv4(),
          type: ActivityType.USER_ASSIGNED,
          userId: state.auth.currentUser?.id || '',
          projectId: task.projectId,
          taskId: task.id,
          metadata: { assigneeId: task.assigneeId },
          createdAt: new Date()
        });
      } else {
        this.addActivity({
          id: uuidv4(),
          type: ActivityType.USER_UNASSIGNED,
          userId: state.auth.currentUser?.id || '',
          projectId: task.projectId,
          taskId: task.id,
          metadata: { assigneeId: oldTask.assigneeId },
          createdAt: new Date()
        });
      }
    }

    this.addNotification({
      type: 'success',
      message: `Task "${task.title}" has been updated.`
    });
  }

  @Transactional()
  deleteTask(taskId: string): void {
    const state = appStore.getState();
    const task = state.tasks.tasks.find((t: Task) => t.id === taskId);
    
    if (!task) {
      this.addNotification({
        type: 'error',
        message: `Task not found.`
      });
      return;
    }

    appStore.setState({
      tasks: {
        ...state.tasks,
        tasks: state.tasks.tasks.filter((t: Task) => t.id !== taskId)
      }
    });

    // Add activity
    this.addActivity({
      id: uuidv4(),
      type: ActivityType.TASK_DELETED,
      userId: state.auth.currentUser?.id || '',
      projectId: task.projectId,
      taskId: taskId,
      createdAt: new Date()
    });

    this.addNotification({
      type: 'success',
      message: `Task "${task.title}" has been deleted.`
    });
  }

  @Transactional()
  selectTask(taskId: string): void {
    const state = appStore.getState();
    const selectedTask = state.tasks.tasks.find((t: Task) => t.id === taskId);
    
    appStore.setState({
      tasks: {
        ...state.tasks,
        selectedTask
      }
    });
  }

  // Comment actions
  @Transactional()
  setComments(comments: Comment[]): void {
    appStore.setState({
      comments: {
        ...appStore.getState().comments,
        comments,
        loading: false
      }
    });
  }

  @Transactional()
  addComment(comment: Comment): void {
    const state = appStore.getState();
    appStore.setState({
      comments: {
        ...state.comments,
        comments: [...state.comments.comments, comment]
      }
    });

    // Find the task to get the project ID
    const task = state.tasks.tasks.find((t: Task) => t.id === comment.taskId);
    
    if (task) {
      // Add activity
      this.addActivity({
        id: uuidv4(),
        type: ActivityType.COMMENT_ADDED,
        userId: state.auth.currentUser?.id || '',
        projectId: task.projectId,
        taskId: comment.taskId,
        commentId: comment.id,
        createdAt: new Date()
      });
    }

    this.addNotification({
      type: 'info',
      message: `Comment has been added.`
    });
  }

  // Activity actions
  @Transactional()
  setActivities(activities: Activity[]): void {
    appStore.setState({
      activities: {
        ...appStore.getState().activities,
        activities,
        loading: false
      }
    });
  }

  @Transactional()
  addActivity(activity: Activity): void {
    const state = appStore.getState();
    appStore.setState({
      activities: {
        ...state.activities,
        activities: [activity, ...state.activities.activities]
      }
    });
  }

  // UI actions
  @Transactional()
  toggleSidebar(): void {
    const state = appStore.getState();
    appStore.setState({
      ui: {
        ...state.ui,
        sidebarOpen: !state.ui.sidebarOpen
      }
    });
  }

  @Transactional()
  setCurrentView(view: string): void {
    appStore.setState({
      ui: {
        ...appStore.getState().ui,
        currentView: view
      }
    });
  }

  @Transactional()
  setTheme(theme: 'light' | 'dark'): void {
    appStore.setState({
      ui: {
        ...appStore.getState().ui,
        theme
      }
    });

    this.addNotification({
      type: 'info',
      message: `Theme changed to ${theme}.`
    });
  }

  @Transactional()
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const state = appStore.getState();
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      timestamp: new Date(),
      read: false
    };

    appStore.setState({
      ui: {
        ...state.ui,
        notifications: [newNotification, ...state.ui.notifications]
      }
    });
  }

  @Transactional()
  markNotificationAsRead(notificationId: string): void {
    const state = appStore.getState();
    appStore.setState({
      ui: {
        ...state.ui,
        notifications: state.ui.notifications.map((n: Notification) => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      }
    });
  }

  @Transactional()
  clearNotifications(): void {
    appStore.setState({
      ui: {
        ...appStore.getState().ui,
        notifications: []
      }
    });
  }

  // Dashboard actions
  getDashboardStats() {
    const state = appStore.getState();
    
    const totalProjects = state.projects.projects.length;
    const activeProjects = state.projects.projects.filter(
      (p: Project) => p.status === ProjectStatus.IN_PROGRESS
    ).length;
    const completedProjects = state.projects.projects.filter(
      (p: Project) => p.status === ProjectStatus.COMPLETED
    ).length;
    
    const totalTasks = state.tasks.tasks.length;
    const tasksInProgress = state.tasks.tasks.filter(
      (t: Task) => t.status === TaskStatus.IN_PROGRESS
    ).length;
    const tasksDone = state.tasks.tasks.filter(
      (t: Task) => t.status === TaskStatus.DONE
    ).length;
    
    // Get tasks with upcoming deadlines (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const upcomingDeadlines = state.tasks.tasks.filter((task: Task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= nextWeek && task.status !== TaskStatus.DONE;
    });
    
    // Get recent activities (last 10)
    const recentActivities = state.activities.activities.slice(0, 10);
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      tasksInProgress,
      tasksDone,
      upcomingDeadlines,
      recentActivities
    };
  }
}

// Export singleton instance
export const appStoreService = new AppStoreService(); 