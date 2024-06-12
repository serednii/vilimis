export const LOADER_ACTIONS = {
    SHOW: "SHOW",
    HIDE: "HIDE",
};

export const loaderReducer = (state, {action, ...args}) => {
    switch (action) {
        case LOADER_ACTIONS.SHOW: {
            return {
                show: state.show+1
            };
        }

        case LOADER_ACTIONS.HIDE: {
            return {
                show: state.show-1
            };
        }

        default:
            return state;
    }
};
