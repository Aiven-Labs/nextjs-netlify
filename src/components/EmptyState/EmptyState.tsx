import { Box, EmptyState as AivenEmptyState, EmptyStateProps } from '@aivenio/aquarium';

interface Props extends Pick<EmptyStateProps, 'primaryAction'> {
  title: string;
}

export const EmptyState: React.FC<Props> = ({ title, primaryAction }) => (
  <Box width="full">
    <AivenEmptyState imageWidth={184} primaryAction={primaryAction} title={title} />
  </Box>
);
