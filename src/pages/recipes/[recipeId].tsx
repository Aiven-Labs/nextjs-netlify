import { Box, Button } from '@aivenio/aquarium';
import arrowLeft from '@aivenio/aquarium/icons/arrowLeft';

import { NavLink } from '@/components/NavLink/NavLink';
import { RecipeDetail } from '@/components/RecipeDetail/RecipeDetail';

export default function Recipe() {
  return (
    <>
      <Box.Flex>
        <NavLink href="/recipes">
          <Button.Icon icon={arrowLeft}>Back to all recipes</Button.Icon>
        </NavLink>
      </Box.Flex>
      <RecipeDetail />
    </>
  );
}
