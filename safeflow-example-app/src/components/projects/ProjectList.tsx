import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * Project List Component
 * 
 * Displays a list of projects
 */
const ProjectList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Project list component is under development.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProjectList; 