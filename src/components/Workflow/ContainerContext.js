import { createContext, useContext } from "react";

const ContainerContext = createContext({});

export const ContainerContextProvider = ContainerContext.Provider;

export const useContainerContext = () => {
  return useContext(ContainerContext);
};
