import {EntityContextProvider} from "./EntityContext";
import {entityReducer, ENTITY_ACTIONS} from "../../reducers/entityReducer";
import React, { useReducer, useState, useEffect } from "react";
import {CONFIG} from "../../config";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {ACTIONS} from "../../reducer";
import EntityDraggableElement from "./EntityDraggableElement";
import {useParams} from "react-router-dom";

const INITIAL_STATE = {
    entities: {},
    properties: {},
    propertiesSelected: {},
    status: {}
}

const EntityEdit = () => {
    const {id} = useParams();
    const [init, setInit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [state, dispatch] = useReducer(entityReducer, INITIAL_STATE);
    const entity = Array.from(state.entities).find(e=>e.id == id);

    const move = (fromIndex, toIndex) =>
        dispatch({ action: ENTITY_ACTIONS.MOVE_PROPERTY, fromIndex, toIndex });
    const find = (_id) => Array.from(state.propertiesSelected).findIndex((entity)=>entity.id == _id)

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
                        propertiesSelected: result.items.filter(item=>item.moduleId==id),
                        status: result.modules_status
                    });
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            )
    },[init, id]);
//    const add = (type, parent) => dispatch({ action: ENTITY_ACTIONS.ADD, type, parent });

    useEffect(()=>{
        console.log("xxx-other");
    }, [state])

    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const sendForm = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        let object = {};
        data.forEach(function(value, key){
            object[key] = value;
        });

        await postData(CONFIG.api + CONFIG.endpointEntityEdit, object);
        setInit(!init);

        return false;
    }


    return (
        <EntityContextProvider
            value={{...state, dispatch, find, move}}
        >
            {loading ? (
                <p>Načítání ...</p>
            ) : (
                Array.from(state.propertiesSelected).length === 0 ? (
                    <p>žádná položka</p>
                ) : (

                    <div>
                        <form onSubmit={sendForm} className="card border-0 shadow">
                            <input type="hidden" name="id" defaultValue={entity.id}/>
                            <div
                                className="card-header border-bottom d-flex align-items-center justify-content-between">
                                <h2 className="fs-5 fw-bold mb-0">Nastavení entity</h2>
                                <button type="submit" className="btn btn-primary">Uložit</button>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label htmlFor="entity-name">Název</label>
                                    <input type="text"
                                           name="name" defaultValue={entity.name}
                                           className="form-control" id="entity-name"
                                           required/>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="mb-4">
                                            <label htmlFor="entity-slugSingular">Slug - jednotné číslo</label>
                                            <input type="text"
                                                   name="slugSingular" defaultValue={entity.slugSingular}
                                                   className="form-control" id="entity-slugSingular"
                                                   required/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="mb-4">
                                            <label htmlFor="entity-slugPluralr">Slug - množné číslo</label>
                                            <input type="text"
                                                   name="slugPlural" defaultValue={entity.slugPlural}
                                                   className="form-control" id="entity-slugPlural"
                                                   required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="entity-icon">Ikonka</label>
                                    <input type="text"
                                           name="icon" defaultValue={entity.icon}
                                           className="form-control" id="entity-icon"
                                           required/>
                                </div>
                                <div className="mb-4">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" name="inMenu" type="checkbox" id="entity-inMenu"
                                               defaultChecked={entity.inMenu}/>
                                        <label className="form-check-label" htmlFor="entity-inMenu">
                                            Zobrazit v menu
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <h2 className="fs-5 fw-bold mt-4">Pole</h2>

                        <DndProvider backend={HTML5Backend}>
                            <div className={"gephart-generator-entity-list"}>
                            {Array.from(state.propertiesSelected).map((item, key) => (
                                <EntityDraggableElement id={item.id} key={item.id} index={key}>
                                    <div>
                                        <strong>{item.name}</strong> | {item.type}  | {item.slug} | {item.slugPlural}
                                    </div>
                                </EntityDraggableElement>
                            ))}
                                <div className={"gephart-generator-entity-item-wrap"}>
                                    Přidat
                                </div>
                            </div>
                        </DndProvider>
                    </div>
                )
            )}
        </EntityContextProvider>
    );
}

export default EntityEdit;