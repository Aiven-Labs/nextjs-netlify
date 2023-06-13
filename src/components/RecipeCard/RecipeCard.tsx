import { Box } from "@aivenio/aquarium";
import React, { PropsWithChildren } from "react";

export const RecipeCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Box flex={1} style={{ minWidth: "20rem" }}>
    {children}
  </Box>
);
