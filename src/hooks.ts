import { useAppContext } from './context';

export const useRecipes = () => {
  const { setAlert, setAddingRecipeIdToFavorites } = useAppContext();

  const addRecipeToFavorites = async ({
    isFavorite,
    id,
    onSuccess,
  }: {
    isFavorite: boolean;
    id: number;
    onSuccess: () => void;
  }) => {
    setAlert(null);
    setAddingRecipeIdToFavorites(id);

    const handleError = () => {
      setAlert({
        type: 'error',
        title: 'Error while adding recipe to favorites.',
        onDismiss: () => setAlert(null),
      });
    };

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFavorite }),
      });

      if (!res.ok) {
        handleError();
      }

      onSuccess();
    } catch {
      handleError();
    } finally {
      setAddingRecipeIdToFavorites(null);
    }
  };

  return { addRecipeToFavorites };
};
