import { Box, Button, Chip, Typography } from '@aivenio/aquarium';
import book from '@aivenio/aquarium/icons/book';
import learning from '@aivenio/aquarium/icons/learning';
import linkExternal from '@aivenio/aquarium/icons/linkExternal';

export default function Home() {
  return (
    <Box.Flex
      marginTop="l5"
      flexDirection="column"
      gap="5"
      alignItems="center"
      flex={1}
      style={{ textAlign: 'center' }}
    >
      <Box display="flex" gap="3" justifyContent="center" className="flex-wrap">
        <Chip text="Aiven for PostgreSQL®" />
        <Chip text="Aiven for Redis®" />
      </Box>
      <Typography.LargeHeading>
        Free Netlify quickstart recipe library app using Next.js, Prisma and Aiven
      </Typography.LargeHeading>
      <Typography.Large color="grey-60">
        A PostgreSQL and Redis optimized Next.js application built with Aiven, Prisma and open source data - for free.
      </Typography.Large>
      <Box.Flex gap="5" justifyContent="center" className="flex-wrap">
        <Button.ExternalLink href="https://github.com/aiven/nextjs-netlify" target="_blank">
          Deploy to Netlify
        </Button.ExternalLink>
        <Button.ExternalLink href="https://github.com/aiven/nextjs-netlify" kind="secondary" target="_blank">
          Star on GitHub
        </Button.ExternalLink>
      </Box.Flex>
      <Box.Flex marginTop="auto" padding="5" gap="5" justifyContent="center" className="flex-wrap">
        <Button.IconExternalLink icon={book} href="https://docs.netlify.com/" target="_blank">
          Netlify docs
        </Button.IconExternalLink>
        <Button.IconExternalLink icon={book} href="https://docs.aiven.io/" target="_blank">
          Aiven docs
        </Button.IconExternalLink>
        <Button.IconExternalLink icon={learning} href="https://aiven.io/community/forum/" target="_blank">
          Aiven community forum
        </Button.IconExternalLink>
        <Button.IconExternalLink
          icon={linkExternal}
          iconPlacement="right"
          href="https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life"
          target="_blank"
        >
          Data source
        </Button.IconExternalLink>
      </Box.Flex>
    </Box.Flex>
  );
}
