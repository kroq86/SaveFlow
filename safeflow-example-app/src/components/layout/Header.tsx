import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Box,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

import { appStoreService } from '../../state/store';
import { apiService } from '../../services/api.service';

// Header props interface
interface HeaderProps {
  sidebarWidth: number;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

/**
 * Header Component
 * 
 * Displays the application header with app bar, user menu, and theme toggle
 */
const Header: React.FC<HeaderProps> = ({ sidebarWidth, sidebarOpen, onSidebarToggle }) => {
  // Navigation
  const navigate = useNavigate();
  
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  
  // Get current user and theme from store
  const { currentUser } = appStoreService.getState().auth;
  const { theme } = appStoreService.getState().ui;
  
  // Handle menu open
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = async () => {
    handleMenuClose();
    try {
      await apiService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    handleMenuClose();
    if (currentUser) {
      navigate(`/users/${currentUser.id}`);
    }
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    appStoreService.setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Menu ID
  const menuId = 'primary-search-account-menu';
  
  // Render user menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%' },
          ml: { sm: sidebarOpen ? `${sidebarWidth}px` : 0 },
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onSidebarToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            SafeFlow PMS
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Theme toggle */}
            <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton color="inherit" onClick={handleThemeToggle}>
                {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            
            {/* User menu */}
            <Tooltip title="Account settings">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt={currentUser?.firstName}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 32, height: 32 }}
                >
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default Header; 