import { useAppContext } from './context';

export const useRecipes = () => {
  const { setAlert, startChangingRecipeIdLiked, stopChangingRecipeIdLiked } = useAppContext();

  const changeRecipeLiked = async ({
    isLiked,
    id,
    onSuccess,
  }: {
    isLiked: boolean;
    id: number;
    onSuccess: () => Promise<void>;
  }) => {
    setAlert(null);
    startChangingRecipeIdLiked(id);

    const handleError = () => {
      setAlert({
        type: 'error',
        title: 'Error while adding recipe to liked.',
        onDismiss: () => setAlert(null),
      });
    };

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isLiked }),
      });

      if (!res.ok) {
        handleError();
      }

      await onSuccess();
    } catch {
      handleError();
    } finally {
      stopChangingRecipeIdLiked(id);
    }
  };

  return { changeRecipeLiked };
};
