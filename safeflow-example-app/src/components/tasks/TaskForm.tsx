import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Task Form Component
 * 
 * Form for creating or editing a task
 */
const TaskForm: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const isEditing = Boolean(taskId);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Edit Task' : 'Create Task'}
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Task form component {isEditing ? `for task ID: ${taskId}` : ''} is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TaskForm; 