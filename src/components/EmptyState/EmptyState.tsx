import {
  EmptyState as AivenEmptyState,
  Box,
  EmptyStateProps,
} from "@aivenio/aquarium";
import React from "react";

interface Props extends Pick<EmptyStateProps, "primaryAction"> {
  title: string;
}

export const EmptyState: React.FC<Props> = ({ title, primaryAction }) => (
  <Box width="full">
    <AivenEmptyState
      imageWidth={184}
      primaryAction={primaryAction}
      title={title}
    />
  </Box>
);
