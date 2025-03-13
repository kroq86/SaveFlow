import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  People as UserIcon,
  AccessTime as TimeIcon,
  CheckCircle as DoneIcon,
  Error as CriticalIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { appStoreService } from '../../state/store';
import { apiService } from '../../services/api.service';
import { AppState } from '../../state/state';
import { Activity, ActivityType, Task, TaskPriority, TaskStatus } from '../../domain/models';
import { formatDistanceToNow } from 'date-fns';

/**
 * Dashboard Component
 * 
 * Displays an overview of the project management system with statistics and recent activities
 */
const Dashboard: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  
  // State
  const [appState, setAppState] = useState<AppState>(appStoreService.getState());
  const [loading, setLoading] = useState<boolean>(true);
  
  // Subscribe to store changes and load data
  useEffect(() => {
    // Subscribe to store changes
    const subscription = appStoreService.subscribe(
      (state) => {
        setAppState(state);
      },
      (error) => {
        console.error('Error in store subscription:', error);
      }
    );
    
    // Load data
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          apiService.getProjects(),
          apiService.getTasks(),
          apiService.getUsers(),
          apiService.getComments()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Get dashboard stats
  const stats = appStoreService.getDashboardStats();
  
  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'success';
      case TaskPriority.MEDIUM:
        return 'info';
      case TaskPriority.HIGH:
        return 'warning';
      case TaskPriority.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get priority icon
  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return <CriticalIcon color="error" />;
      case TaskPriority.HIGH:
        return <WarningIcon color="warning" />;
      default:
        return null;
    }
  };
  
  // Format activity message
  const formatActivityMessage = (activity: Activity): string => {
    const user = appState.users.users.find(u => u.id === activity.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown user';
    
    switch (activity.type) {
      case ActivityType.PROJECT_CREATED:
        const newProject = appState.projects.projects.find(p => p.id === activity.projectId);
        return `${userName} created project "${newProject?.name || 'Unknown'}"`;
      
      case ActivityType.PROJECT_UPDATED:
        const updatedProject = appState.projects.projects.find(p => p.id === activity.projectId);
        return `${userName} updated project "${updatedProject?.name || 'Unknown'}"`;
      
      case ActivityType.TASK_CREATED:
        const newTask = appState.tasks.tasks.find(t => t.id === activity.taskId);
        return `${userName} created task "${newTask?.title || 'Unknown'}"`;
      
      case ActivityType.TASK_UPDATED:
        const updatedTask = appState.tasks.tasks.find(t => t.id === activity.taskId);
        return `${userName} updated task "${updatedTask?.title || 'Unknown'}"`;
      
      case ActivityType.USER_ASSIGNED:
        const assignedTask = appState.tasks.tasks.find(t => t.id === activity.taskId);
        const assignedUser = appState.users.users.find(u => u.id === activity.metadata?.assigneeId);
        return `${userName} assigned ${assignedUser?.firstName || 'Unknown'} to "${assignedTask?.title || 'Unknown'}"`;
      
      case ActivityType.COMMENT_ADDED:
        const commentTask = appState.tasks.tasks.find(t => t.id === activity.taskId);
        return `${userName} commented on "${commentTask?.title || 'Unknown'}"`;
      
      default:
        return `${userName} performed an action`;
    }
  };
  
  // Get activity time
  const getActivityTime = (activity: Activity): string => {
    return formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
  };
  
  // Get activity icon
  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case ActivityType.PROJECT_CREATED:
      case ActivityType.PROJECT_UPDATED:
      case ActivityType.PROJECT_DELETED:
        return <ProjectIcon />;
      
      case ActivityType.TASK_CREATED:
      case ActivityType.TASK_UPDATED:
      case ActivityType.TASK_DELETED:
        return <TaskIcon />;
      
      case ActivityType.USER_ASSIGNED:
      case ActivityType.USER_UNASSIGNED:
        return <UserIcon />;
      
      case ActivityType.COMMENT_ADDED:
        return <DashboardIcon />;
      
      default:
        return <DashboardIcon />;
    }
  };
  
  // Navigate to task
  const navigateToTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Projects Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Projects
              </Typography>
              <ProjectIcon />
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalProjects}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {stats.activeProjects} active, {stats.completedProjects} completed
            </Typography>
          </Paper>
        </Grid>
        
        {/* Tasks Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'secondary.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Tasks
              </Typography>
              <TaskIcon />
            </Box>
            <Typography component="p" variant="h4">
              {stats.totalTasks}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {stats.tasksInProgress} in progress, {stats.tasksDone} completed
            </Typography>
          </Paper>
        </Grid>
        
        {/* Users Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Team Members
              </Typography>
              <UserIcon />
            </Box>
            <Typography component="p" variant="h4">
              {appState.users.users.length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Collaborating on {stats.activeProjects} active projects
            </Typography>
          </Paper>
        </Grid>
        
        {/* Deadlines Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <TimeIcon />
            </Box>
            <Typography component="p" variant="h4">
              {stats.upcomingDeadlines.length}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tasks due in the next 7 days
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.upcomingDeadlines.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No upcoming deadlines in the next 7 days.
              </Typography>
            ) : (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {stats.upcomingDeadlines.map((task: Task) => (
                  <Card key={task.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          {task.title}
                          {getPriorityIcon(task.priority)}
                        </Typography>
                        <Chip
                          label={TaskPriority[task.priority]}
                          color={getPriorityColor(task.priority) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Due: {new Date(task.dueDate!).toLocaleDateString()}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {task.description?.substring(0, 100)}
                        {task.description && task.description.length > 100 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={TaskStatus[task.status]}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        
                        {task.assigneeId && (
                          <Chip
                            avatar={
                              <Avatar>
                                {appState.users.users.find(u => u.id === task.assigneeId)?.firstName.charAt(0)}
                              </Avatar>
                            }
                            label={appState.users.users.find(u => u.id === task.assigneeId)?.firstName}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => navigateToTask(task.id)}>
                        View Task
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {stats.recentActivities.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No recent activities.
              </Typography>
            ) : (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {stats.recentActivities.map((activity: Activity) => (
                  <ListItem key={activity.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getActivityIcon(activity)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={formatActivityMessage(activity)}
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {getActivityTime(activity)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 