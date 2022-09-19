import { createContext, useContext } from "react";

const EntityContext = createContext({});

export const EntityContextProvider = EntityContext.Provider;

export const useEntityContext = () => {
    return useContext(EntityContext);
};