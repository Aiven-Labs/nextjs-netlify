import { useAppContext } from "./context";

export const useRecipes = () => {
  const { setAlert, setAddingRecipeIdToFavorites } = useAppContext();

  const addRecipeToFavorites = async ({
    isFavorite,
    id,
    callback,
  }: {
    isFavorite: boolean;
    id: number;
    callback: () => void;
  }) => {
    setAlert(null);
    setAddingRecipeIdToFavorites(id);

    try {
      await fetch(`/api/recipes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite }),
      });

      callback?.();
    } catch {
      setAlert({
        type: "error",
        title: "Error while adding recipe to favorites.",
        onDismiss: () => setAlert(null),
      });
    } finally {
      setAddingRecipeIdToFavorites(null);
    }
  };

  return { addRecipeToFavorites };
};
