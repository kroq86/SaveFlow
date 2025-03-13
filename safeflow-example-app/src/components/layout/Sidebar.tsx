import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  People as UserIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import { appStoreService } from '../../state/store';
import { UserRole } from '../../domain/models';

// Sidebar props interface
interface SidebarProps {
  width: number;
  open: boolean;
  onClose: () => void;
}

/**
 * Sidebar Component
 * 
 * Displays the application sidebar with navigation menu
 */
const Sidebar: React.FC<SidebarProps> = ({ width, open, onClose }) => {
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get current user from store
  const { currentUser } = appStoreService.getState().auth;
  
  // Navigation items
  const navItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.VIEWER]
    },
    {
      text: 'Projects',
      icon: <ProjectIcon />,
      path: '/projects',
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.VIEWER]
    },
    {
      text: 'Tasks',
      icon: <TaskIcon />,
      path: '/tasks',
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.DEVELOPER, UserRole.VIEWER]
    },
    {
      text: 'Users',
      icon: <UserIcon />,
      path: '/users',
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER]
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      roles: [UserRole.ADMIN]
    }
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose && window.innerWidth < theme.breakpoints.values.sm) {
      onClose();
    }
  };
  
  // Drawer content
  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SafeFlow PMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                borderRight: `3px solid ${theme.palette.primary.main}`,
              },
              '&.Mui-selected:hover': {
                backgroundColor: theme.palette.primary.main + '30',
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: (location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))) ? 
                  theme.palette.primary.main : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                color: (location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))) ? 
                  theme.palette.primary.main : 'inherit'
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          SafeFlow Framework
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Version 0.1.0
        </Typography>
      </Box>
    </>
  );
  
  return (
    <Box
      component="nav"
      sx={{ width: { sm: open ? width : 0 }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 