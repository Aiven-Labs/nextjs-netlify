import React, { ReactNode } from 'react';
import { Box } from '@aivenio/aquarium';

export const RecipeCard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Box flex={1} style={{ minWidth: '20rem' }}>
    {children}
  </Box>
);
