import {ACTIONS} from "../reducer";

export const ENTITY_ACTIONS = {
    LOAD: "LOAD",
    MOVE: "MOVE",
    MOVE_PROPERTY: "MOVE_PROPERTY",
    ADD_PROPERTY: "ADD_PROPERTY",
};

export const entityReducer = (state, {action, ...args}) => {
    switch (action) {
        case ENTITY_ACTIONS.LOAD: {
            const {entities, properties, status, propertiesSelected} = args;

            return {
                ...state,
                entities,
                properties,
                propertiesSelected,
                status
            };
        }
        case ENTITY_ACTIONS.ADD_PROPERTY: {
            const {entityId} = args;

            const propertiesSelected = Array.from(state.propertiesSelected);
            propertiesSelected.push({
                id: "new-" + propertiesSelected.length,
                sort: propertiesSelected.length,
                name: "",
                type: "",
                slug: "",
                moduleId: entityId
            });

            return {
                ...state,
                propertiesSelected
            };
        }
        case ENTITY_ACTIONS.MOVE: {
            const {fromIndex, toIndex} = args;

            if (fromIndex === toIndex) {
                return state;
            }

            const entities = Array.from(state.entities);
            const [element] = entities.splice(fromIndex, 1);

            entities.splice(toIndex, 0, element);
            return {
                ...state,
                entities
            };

        }
        case ENTITY_ACTIONS.MOVE_PROPERTY: {
            const {fromIndex, toIndex} = args;
            console.log(fromIndex+"----"+toIndex);

            if (fromIndex === toIndex) {
                return state;
            }

            const propertiesSelected = Array.from(state.propertiesSelected);
            const [element] = propertiesSelected.splice(fromIndex, 1);

            propertiesSelected.splice(toIndex, 0, element);
            return {
                ...state,
                propertiesSelected
            };

        }

        default:
            return state;
    }
};
