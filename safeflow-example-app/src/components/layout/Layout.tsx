import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, Container, useMediaQuery, useTheme } from '@mui/material';

import { appStoreService } from '../../state/store';
import { AppState } from '../../state/state';

import Header from './Header';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

/**
 * Main Layout Component
 * 
 * Provides the application layout with header, sidebar, and content area
 */
const Layout: React.FC = () => {
  // Theme and responsive layout
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [appState, setAppState] = useState<AppState>(appStoreService.getState());
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobile);
  
  // Sidebar width
  const sidebarWidth = 240;
  
  // Subscribe to store changes
  useEffect(() => {
    const subscription = appStoreService.subscribe(
      (state) => {
        setAppState(state);
        setSidebarOpen(state.ui.sidebarOpen && !isMobile);
      },
      (error) => {
        console.error('Error in store subscription:', error);
      }
    );
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [isMobile]);
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    appStoreService.toggleSidebar();
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header 
        sidebarWidth={sidebarWidth} 
        sidebarOpen={sidebarOpen} 
        onSidebarToggle={handleSidebarToggle} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        width={sidebarWidth} 
        open={sidebarOpen} 
        onClose={handleSidebarToggle} 
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? sidebarWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${sidebarWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for fixed header */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
      
      {/* Notifications */}
      <Notifications notifications={appState.ui.notifications} />
    </Box>
  );
};

export default Layout; 