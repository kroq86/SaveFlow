import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Task List Component
 * 
 * Displays a list of tasks
 */
const TaskList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Task list component is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TaskList; 