import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { appStoreService } from './state/store';
import { AppState } from './state/state';

// Layout components
import Layout from './components/layout/Layout';

// Auth components
import Login from './components/auth/Login';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';

// Project components
import ProjectList from './components/projects/ProjectList';
import ProjectDetails from './components/projects/ProjectDetails';
import ProjectForm from './components/projects/ProjectForm';

// Task components
import TaskList from './components/tasks/TaskList';
import TaskDetails from './components/tasks/TaskDetails';
import TaskForm from './components/tasks/TaskForm';

// User components
import UserList from './components/users/UserList';
import UserDetails from './components/users/UserDetails';
import UserForm from './components/users/UserForm';

/**
 * Main App Component
 * 
 * Handles routing and authentication state
 */
const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(appStoreService.getState());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Subscribe to store changes
  useEffect(() => {
    const subscription = appStoreService.subscribe(
      (state) => {
        setAppState(state);
      },
      (error) => {
        console.error('Error in store subscription:', error);
      }
    );

    // Set loading to false after a short delay to allow auth check to complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  // If not authenticated, show login
  if (!appState.auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Main app routes (authenticated)
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Projects */}
        <Route path="projects">
          <Route index element={<ProjectList />} />
          <Route path="new" element={<ProjectForm />} />
          <Route path=":projectId" element={<ProjectDetails />} />
          <Route path=":projectId/edit" element={<ProjectForm />} />
        </Route>
        
        {/* Tasks */}
        <Route path="tasks">
          <Route index element={<TaskList />} />
          <Route path="new" element={<TaskForm />} />
          <Route path=":taskId" element={<TaskDetails />} />
          <Route path=":taskId/edit" element={<TaskForm />} />
        </Route>
        
        {/* Users (admin only) */}
        <Route path="users">
          <Route index element={<UserList />} />
          <Route path="new" element={<UserForm />} />
          <Route path=":userId" element={<UserDetails />} />
          <Route path=":userId/edit" element={<UserForm />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App; 