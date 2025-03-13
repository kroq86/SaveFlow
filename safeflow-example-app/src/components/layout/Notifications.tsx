import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { Notification } from '../../state/state';
import { appStoreService } from '../../state/store';

// Notifications props interface
interface NotificationsProps {
  notifications: Notification[];
}

/**
 * Notifications Component
 * 
 * Displays toast notifications from the application state
 */
const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  // State for active notifications
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  
  // Update active notifications when notifications change
  useEffect(() => {
    // Get unread notifications
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Update active notifications
    setActiveNotifications(unreadNotifications);
    
    // Mark notifications as read after a delay
    if (unreadNotifications.length > 0) {
      const timer = setTimeout(() => {
        unreadNotifications.forEach(notification => {
          appStoreService.markNotificationAsRead(notification.id);
        });
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  // Handle close notification
  const handleClose = (id: string) => {
    appStoreService.markNotificationAsRead(id);
  };
  
  return (
    <Stack spacing={2} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000 }}>
      {activeNotifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={!notification.read}
          autoHideDuration={5000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'static', mb: 1 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type as 'success' | 'info' | 'warning' | 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default Notifications; 