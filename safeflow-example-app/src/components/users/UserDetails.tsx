import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

/**
 * User Details Component
 * 
 * Displays details of a specific user
 */
const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          User details component for user ID: {userId} is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserDetails; 