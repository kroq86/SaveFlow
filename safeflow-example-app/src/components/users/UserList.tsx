import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * User List Component
 * 
 * Displays a list of users
 */
const UserList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          User list component is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserList; 