import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { AlertProps } from '@aivenio/aquarium';

type Alert = AlertProps | null | undefined;

interface State {
  alert: Alert;
  setAlert: Dispatch<SetStateAction<Alert>>;
  changingRecipeIdsLiked: number[];
  startChangingRecipeIdLiked: (recipeId: number) => void;
  stopChangingRecipeIdLiked: (recipeId: number) => void;
}

const Context = createContext<State | null>(null);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertProps | null>();
  const [changingRecipeIdsLiked, setChangingRecipeIdsLiked] = useState<number[]>([]);

  const startChangingRecipeIdLiked = (recipeId: number) => setChangingRecipeIdsLiked((curr) => [...curr, recipeId]);
  const stopChangingRecipeIdLiked = (recipeId: number) =>
    setChangingRecipeIdsLiked((curr) => curr.filter((id) => id !== recipeId));

  return (
    <Context.Provider
      value={{
        alert,
        setAlert,
        changingRecipeIdsLiked,
        startChangingRecipeIdLiked,
        stopChangingRecipeIdLiked,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);

  if (context === null) {
    throw Error('useAppContext cannot be used outside ContextProvider!');
  }

  return context;
};
