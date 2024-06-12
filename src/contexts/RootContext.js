import React from 'react';

const RootContext = React.createContext();

export function useRootContext() {
    return React.useContext(RootContext);
}

export default RootContext;