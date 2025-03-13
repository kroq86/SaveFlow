import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Project Details Component
 * 
 * Displays details of a specific project
 */
const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Project Details
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Project details component for project ID: {projectId} is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProjectDetails; 