import { Layout } from "@/components/Layout/Layout";
import { Box, Button, Chip, Icon, Link, Typography } from "@aivenio/aquarium";
import arrowRight from "@aivenio/aquarium/icons/arrowRight";

export default function Home() {
  return (
    <Layout>
      <Box.Flex
        marginTop="l5"
        flexDirection="column"
        gap="5"
        alignItems="center"
        flex={1}
        style={{ textAlign: "center" }}
      >
        <Box display="flex" gap="3">
          <Chip text="Aiven for PostgreSQL®" />
          <Chip text="Aiven for Redis®" />
        </Box>
        <Typography.LargeHeading>
          Free quickstart app using Next.js, Prisma and Aiven
        </Typography.LargeHeading>
        <Typography variant="body-large" color="grey-60">
          A PostgreSQL and Redis optimized React application built with Aiven,
          Prisma, Netlify, with open source data - for free.
        </Typography>
        <Box.Flex gap="5">
          <Button.ExternalLink href="#">Deploy to Netlify</Button.ExternalLink>
          <Button.ExternalLink
            href="https://github.com/aiven/nextjs-netlify"
            kind="secondary"
            target="_blank"
          >
            Star on GitHub
          </Button.ExternalLink>
        </Box.Flex>
        <Button.ExternalLink href="#" kind="ghost">
          <Box.Flex alignItems="center" gap="2">
            Documentation <Icon icon={arrowRight} />
          </Box.Flex>
        </Button.ExternalLink>
        <Box.Flex marginTop="auto" padding="5" gap="5">
          <Button.ExternalLink href="#" kind="ghost">
            Netlify docs
          </Button.ExternalLink>
          <Button.ExternalLink href="#" kind="ghost">
            Aiven docs
          </Button.ExternalLink>
          <Button.ExternalLink
            href="https://www.kaggle.com/datasets/thedevastator/better-recipes-for-a-better-life"
            kind="ghost"
            target="_blank"
          >
            Data source
          </Button.ExternalLink>
        </Box.Flex>
      </Box.Flex>
    </Layout>
  );
}
