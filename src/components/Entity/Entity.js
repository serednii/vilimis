import {EntityContextProvider} from "./EntityContext";
import {entityReducer, ENTITY_ACTIONS} from "../../reducers/entityReducer";
import React, { useReducer, useState, useEffect } from "react";
import {CONFIG} from "../../config";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {ACTIONS} from "../../reducer";
import EntityDraggableElement from "./EntityDraggableElement";
import {Link, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const INITIAL_STATE = {
    entities: {},
    properties: {},
    status: {}
}

const Entity = () => {
    const [init] = useState(true);
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [state, dispatch] = useReducer(entityReducer, INITIAL_STATE);

    const move = (fromIndex, toIndex) =>
        dispatch({ action: ENTITY_ACTIONS.MOVE, fromIndex, toIndex });
    const find = (id) => Array.from(state.entities).findIndex((entity)=>entity.id == id)

    useEffect(() => {
        fetch(CONFIG.api + CONFIG.endpointEntityList)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    dispatch({
                        action: ENTITY_ACTIONS.LOAD,
                        entities: result.modules,
                        properties: result.items,
                        status: result.modules_status
                    });
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            )
    },[init]);
//    const add = (type, parent) => dispatch({ action: ENTITY_ACTIONS.ADD, type, parent });

    useEffect(()=>{
        console.log("xxx-other");
    }, [state])


    return (
        <EntityContextProvider
            value={{...state, dispatch, find, move}}
        >
            {loading ? (
                <p>Načítání ...</p>
            ) : (
                Object.values(state.entities).length === 0 ? (
                    <p>žádná entita</p>
                ) : (

                    <DndProvider backend={HTML5Backend}>
                        <div className={"gephart-generator-entity-list"}>
                        {Array.from(state.entities).map((entity, key) => (
                            <EntityDraggableElement id={entity.id} key={entity.id} index={key}>
                                <div className={"row"}>
                                    <div className={"col-auto"}>
                                        <h4>
                                            <FontAwesomeIcon icon={entity.icon?entity.icon:"file"} />
                                            <Link className={"mx-2"} to={`${pathname}/edit/${entity.id}`}>{entity.name}</Link>
                                        </h4>

                                        <div>{entity.slugSingular} / {entity.slugPlural}</div>
                                    </div>
                                    <div className={"col text-end"}>
                                        <Link className={"btn btn-secondary mx-2"} to={`${pathname}/edit/${entity.id}`}>
                                            <FontAwesomeIcon icon={"pencil"}/>
                                        </Link>
                                        <Link className={"btn btn-danger"} to={`${pathname}/edit/${entity.id}`}>
                                            <FontAwesomeIcon icon={"trash"}/>
                                        </Link>
                                    </div>
                                </div>
                            </EntityDraggableElement>
                        ))}
                            <div className={"gephart-generator-entity-item-wrap"}>
                                Přidat
                            </div>
                        </div>
                    </DndProvider>
                )
            )}
        </EntityContextProvider>
    );
}

export default Entity;