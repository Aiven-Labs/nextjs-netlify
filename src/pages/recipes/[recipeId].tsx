import { Box, Button, Link } from '@aivenio/aquarium';
import arrowLeft from '@aivenio/aquarium/icons/arrowLeft';

import { Layout } from '@/components/Layout/Layout';
import { RecipeDetail } from '@/components/RecipeDetail/RecipeDetail';

export default function Recipe() {
  return (
    <Layout>
      <Box.Flex>
        <Button.Ghost icon={arrowLeft}>
          <Link href="/recipes">Back to all recipes</Link>
        </Button.Ghost>
      </Box.Flex>
      <RecipeDetail />
    </Layout>
  );
}
