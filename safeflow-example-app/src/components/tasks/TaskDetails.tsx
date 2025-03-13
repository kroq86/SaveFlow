import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Task Details Component
 * 
 * Displays details of a specific task
 */
const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Task details component for task ID: {taskId} is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TaskDetails; 