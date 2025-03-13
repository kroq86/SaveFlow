/**
 * API Service for handling backend interactions
 */
import { TransactionalClass, Transactional } from 'safeflow-reactive';
import { v4 as uuidv4 } from 'uuid';

import type { 
  User, 
  Project, 
  Task, 
  Comment
} from '../domain/models';
import { 
  UserRole, 
  ProjectStatus, 
  TaskStatus, 
  TaskPriority,
  ActivityType
} from '../domain/models';
import { appStoreService } from '../state/store';

/**
 * Mock API Service
 * 
 * In a real application, this would be replaced with actual API calls
 * to a backend server. For demonstration purposes, we're using a mock
 * implementation with local storage.
 */
@TransactionalClass()
export class ApiService {
  private readonly STORAGE_KEYS = {
    USERS: 'safeflow_pms_users',
    PROJECTS: 'safeflow_pms_projects',
    TASKS: 'safeflow_pms_tasks',
    COMMENTS: 'safeflow_pms_comments',
    AUTH: 'safeflow_pms_auth'
  };

  constructor() {
    // Initialize with mock data if storage is empty
    this.initializeMockData();
  }

  /**
   * Initialize mock data if storage is empty
   */
  private initializeMockData(): void {
    // Check if we already have data
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS);
    
    if (!users || users.length === 0) {
      console.log('Initializing mock data...');
      
      // Create mock users
      const mockUsers: User[] = [
        {
          id: uuidv4(),
          username: 'admin',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          username: 'manager',
          email: 'manager@example.com',
          firstName: 'Project',
          lastName: 'Manager',
          role: UserRole.PROJECT_MANAGER,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          username: 'dev1',
          email: 'dev1@example.com',
          firstName: 'Developer',
          lastName: 'One',
          role: UserRole.DEVELOPER,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          username: 'dev2',
          email: 'dev2@example.com',
          firstName: 'Developer',
          lastName: 'Two',
          role: UserRole.DEVELOPER,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Save mock users
      this.saveToStorage(this.STORAGE_KEYS.USERS, mockUsers);
      
      // Create mock projects
      const mockProjects: Project[] = [
        {
          id: uuidv4(),
          name: 'SafeFlow Framework Development',
          description: 'Develop the SafeFlow reactive framework with transactional guarantees',
          status: ProjectStatus.IN_PROGRESS,
          startDate: new Date(),
          endDate: this.addDays(new Date(), 30),
          managerId: mockUsers[1].id, // Project Manager
          teamMemberIds: [mockUsers[2].id, mockUsers[3].id], // Developers
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          name: 'AI Validator Component',
          description: 'Create a standalone component for validating AI-generated code',
          status: ProjectStatus.PLANNING,
          startDate: this.addDays(new Date(), 7),
          endDate: this.addDays(new Date(), 45),
          managerId: mockUsers[1].id, // Project Manager
          teamMemberIds: [mockUsers[2].id], // Developer One
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Save mock projects
      this.saveToStorage(this.STORAGE_KEYS.PROJECTS, mockProjects);
      
      // Create mock tasks
      const mockTasks: Task[] = [
        {
          id: uuidv4(),
          projectId: mockProjects[0].id,
          title: 'Design reactive store architecture',
          description: 'Create the core architecture for the reactive store with transactional support',
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          assigneeId: mockUsers[2].id, // Developer One
          dueDate: this.addDays(new Date(), -5),
          estimatedHours: 16,
          actualHours: 20,
          createdAt: this.addDays(new Date(), -10),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          projectId: mockProjects[0].id,
          title: 'Implement transaction manager',
          description: 'Create the transaction manager to handle atomic operations',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
          assigneeId: mockUsers[2].id, // Developer One
          dueDate: this.addDays(new Date(), 3),
          estimatedHours: 24,
          actualHours: 10,
          createdAt: this.addDays(new Date(), -7),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          projectId: mockProjects[0].id,
          title: 'Create decorators for transactional methods',
          description: 'Implement TypeScript decorators for marking methods as transactional',
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          assigneeId: mockUsers[3].id, // Developer Two
          dueDate: this.addDays(new Date(), 7),
          estimatedHours: 8,
          actualHours: 0,
          createdAt: this.addDays(new Date(), -3),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          projectId: mockProjects[1].id,
          title: 'Define security rules for AI validation',
          description: 'Create a comprehensive set of security rules for validating AI-generated code',
          status: TaskStatus.TODO,
          priority: TaskPriority.CRITICAL,
          assigneeId: mockUsers[2].id, // Developer One
          dueDate: this.addDays(new Date(), 14),
          estimatedHours: 16,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Save mock tasks
      this.saveToStorage(this.STORAGE_KEYS.TASKS, mockTasks);
      
      // Create mock comments
      const mockComments: Comment[] = [
        {
          id: uuidv4(),
          taskId: mockTasks[0].id,
          userId: mockUsers[1].id, // Project Manager
          content: 'Great job on completing this task! The architecture looks solid.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          taskId: mockTasks[1].id,
          userId: mockUsers[2].id, // Developer One
          content: 'I\'m making good progress on this. Should be done by tomorrow.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          taskId: mockTasks[1].id,
          userId: mockUsers[1].id, // Project Manager
          content: 'Let me know if you need any help or clarification.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Save mock comments
      this.saveToStorage(this.STORAGE_KEYS.COMMENTS, mockComments);
    }
  }

  /**
   * Helper method to add days to a date
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Save data to local storage
   */
  private saveToStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to storage: ${error}`);
    }
  }

  /**
   * Get data from local storage
   */
  private getFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting from storage: ${error}`);
      return null;
    }
  }

  /**
   * Simulate API delay
   */
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth methods
  /**
   * Login user
   */
  @Transactional()
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    await this.delay();
    
    // In a real app, we would validate credentials against the server
    // For demo purposes, we'll just check if the user exists
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.username === username);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Generate a mock token
    const token = `mock-token-${uuidv4()}`;
    
    // Save auth info to storage
    this.saveToStorage(this.STORAGE_KEYS.AUTH, { user, token });
    
    // Update store
    appStoreService.login(user, token);
    
    return { user, token };
  }

  /**
   * Logout user
   */
  @Transactional()
  async logout(): Promise<void> {
    await this.delay();
    
    // Clear auth info from storage
    localStorage.removeItem(this.STORAGE_KEYS.AUTH);
    
    // Update store
    appStoreService.logout();
  }

  /**
   * Check if user is authenticated
   */
  @Transactional()
  async checkAuth(): Promise<boolean> {
    await this.delay(200);
    
    const auth = this.getFromStorage<{ user: User; token: string }>(this.STORAGE_KEYS.AUTH);
    
    if (auth && auth.user && auth.token) {
      // Update store
      appStoreService.login(auth.user, auth.token);
      return true;
    }
    
    return false;
  }

  // User methods
  /**
   * Get all users
   */
  @Transactional()
  async getUsers(): Promise<User[]> {
    await this.delay();
    
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    
    // Update store
    appStoreService.setUsers(users);
    
    return users;
  }

  /**
   * Get user by ID
   */
  @Transactional()
  async getUserById(userId: string): Promise<User> {
    await this.delay();
    
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user;
  }

  /**
   * Create a new user
   */
  @Transactional()
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.delay();
    
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    
    // Check if username or email already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error(`Username ${userData.username} is already taken`);
    }
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error(`Email ${userData.email} is already registered`);
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.USERS, [...users, newUser]);
    
    // Update store
    appStoreService.addUser(newUser);
    
    return newUser;
  }

  /**
   * Update an existing user
   */
  @Transactional()
  async updateUser(userId: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    await this.delay();
    
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if username or email already exists (if being updated)
    if (userData.username && userData.username !== users[userIndex].username) {
      if (users.some(u => u.username === userData.username)) {
        throw new Error(`Username ${userData.username} is already taken`);
      }
    }
    
    if (userData.email && userData.email !== users[userIndex].email) {
      if (users.some(u => u.email === userData.email)) {
        throw new Error(`Email ${userData.email} is already registered`);
      }
    }
    
    // Update user
    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    
    users[userIndex] = updatedUser;
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.USERS, users);
    
    // Update store
    appStoreService.updateUser(updatedUser);
    
    return updatedUser;
  }

  /**
   * Delete a user
   */
  @Transactional()
  async deleteUser(userId: string): Promise<void> {
    await this.delay();
    
    const users = this.getFromStorage<User[]>(this.STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Remove user
    users.splice(userIndex, 1);
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.USERS, users);
    
    // Update store
    appStoreService.deleteUser(userId);
  }

  // Project methods
  /**
   * Get all projects
   */
  @Transactional()
  async getProjects(): Promise<Project[]> {
    await this.delay();
    
    const projects = this.getFromStorage<Project[]>(this.STORAGE_KEYS.PROJECTS) || [];
    
    // Update store
    appStoreService.setProjects(projects);
    
    return projects;
  }

  /**
   * Get project by ID
   */
  @Transactional()
  async getProjectById(projectId: string): Promise<Project> {
    await this.delay();
    
    const projects = this.getFromStorage<Project[]>(this.STORAGE_KEYS.PROJECTS) || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    return project;
  }

  /**
   * Create a new project
   */
  @Transactional()
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    await this.delay();
    
    const projects = this.getFromStorage<Project[]>(this.STORAGE_KEYS.PROJECTS) || [];
    
    // Create new project
    const newProject: Project = {
      id: uuidv4(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, [...projects, newProject]);
    
    // Update store
    appStoreService.addProject(newProject);
    
    return newProject;
  }

  /**
   * Update an existing project
   */
  @Transactional()
  async updateProject(projectId: string, projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> {
    await this.delay();
    
    const projects = this.getFromStorage<Project[]>(this.STORAGE_KEYS.PROJECTS) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Update project
    const updatedProject: Project = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date()
    };
    
    projects[projectIndex] = updatedProject;
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
    
    // Update store
    appStoreService.updateProject(updatedProject);
    
    return updatedProject;
  }

  /**
   * Delete a project
   */
  @Transactional()
  async deleteProject(projectId: string): Promise<void> {
    await this.delay();
    
    const projects = this.getFromStorage<Project[]>(this.STORAGE_KEYS.PROJECTS) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Remove project
    projects.splice(projectIndex, 1);
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.PROJECTS, projects);
    
    // Update store
    appStoreService.deleteProject(projectId);
    
    // Also delete all tasks associated with this project
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    const updatedTasks = tasks.filter(t => t.projectId !== projectId);
    
    // Save updated tasks
    this.saveToStorage(this.STORAGE_KEYS.TASKS, updatedTasks);
    
    // Update tasks in store
    appStoreService.setTasks(updatedTasks);
  }

  // Task methods
  /**
   * Get all tasks
   */
  @Transactional()
  async getTasks(): Promise<Task[]> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    
    // Update store
    appStoreService.setTasks(tasks);
    
    return tasks;
  }

  /**
   * Get tasks by project ID
   */
  @Transactional()
  async getTasksByProjectId(projectId: string): Promise<Task[]> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    
    return projectTasks;
  }

  /**
   * Get task by ID
   */
  @Transactional()
  async getTaskById(taskId: string): Promise<Task> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    return task;
  }

  /**
   * Create a new task
   */
  @Transactional()
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    
    // Create new task
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.TASKS, [...tasks, newTask]);
    
    // Update store
    appStoreService.addTask(newTask);
    
    return newTask;
  }

  /**
   * Update an existing task
   */
  @Transactional()
  async updateTask(taskId: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    // Update task
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date()
    };
    
    tasks[taskIndex] = updatedTask;
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.TASKS, tasks);
    
    // Update store
    appStoreService.updateTask(updatedTask);
    
    return updatedTask;
  }

  /**
   * Delete a task
   */
  @Transactional()
  async deleteTask(taskId: string): Promise<void> {
    await this.delay();
    
    const tasks = this.getFromStorage<Task[]>(this.STORAGE_KEYS.TASKS) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    // Remove task
    tasks.splice(taskIndex, 1);
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.TASKS, tasks);
    
    // Update store
    appStoreService.deleteTask(taskId);
    
    // Also delete all comments associated with this task
    const comments = this.getFromStorage<Comment[]>(this.STORAGE_KEYS.COMMENTS) || [];
    const updatedComments = comments.filter(c => c.taskId !== taskId);
    
    // Save updated comments
    this.saveToStorage(this.STORAGE_KEYS.COMMENTS, updatedComments);
    
    // Update comments in store
    appStoreService.setComments(updatedComments);
  }

  // Comment methods
  /**
   * Get all comments
   */
  @Transactional()
  async getComments(): Promise<Comment[]> {
    await this.delay();
    
    const comments = this.getFromStorage<Comment[]>(this.STORAGE_KEYS.COMMENTS) || [];
    
    // Update store
    appStoreService.setComments(comments);
    
    return comments;
  }

  /**
   * Get comments by task ID
   */
  @Transactional()
  async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    await this.delay();
    
    const comments = this.getFromStorage<Comment[]>(this.STORAGE_KEYS.COMMENTS) || [];
    const taskComments = comments.filter(c => c.taskId === taskId);
    
    return taskComments;
  }

  /**
   * Create a new comment
   */
  @Transactional()
  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    await this.delay();
    
    const comments = this.getFromStorage<Comment[]>(this.STORAGE_KEYS.COMMENTS) || [];
    
    // Create new comment
    const newComment: Comment = {
      id: uuidv4(),
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to storage
    this.saveToStorage(this.STORAGE_KEYS.COMMENTS, [...comments, newComment]);
    
    // Update store
    appStoreService.addComment(newComment);
    
    return newComment;
  }
}

// Export singleton instance
export const apiService = new ApiService(); 