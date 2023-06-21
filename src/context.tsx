import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { AlertProps } from '@aivenio/aquarium';

type Alert = AlertProps | null | undefined;
type AddingRecipeIdToFavorites = number | null | undefined;

interface State {
  alert: Alert;
  setAlert: Dispatch<SetStateAction<Alert>>;
  addingRecipeIdToFavorites: AddingRecipeIdToFavorites;
  setAddingRecipeIdToFavorites: Dispatch<SetStateAction<AddingRecipeIdToFavorites>>;
}

const Context = createContext<State | null>(null);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertProps | null>();
  const [addingRecipeIdToFavorites, setAddingRecipeIdToFavorites] = useState<AddingRecipeIdToFavorites>();

  return (
    <Context.Provider
      value={{
        alert,
        setAlert,
        addingRecipeIdToFavorites,
        setAddingRecipeIdToFavorites,
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
