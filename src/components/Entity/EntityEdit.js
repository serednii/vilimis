import { EntityContextProvider } from "./EntityContext";
import { entityReducer, ENTITY_ACTIONS } from "../../reducers/entityReducer";
import React, { useReducer, useState, useEffect, useRef } from "react";
import { CONFIG } from "../../config";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import EntityDraggableElement from "./EntityDraggableElement";
import { useParams } from "react-router-dom";
import { useRootContext } from "../../contexts/RootContext";
import { LOADER_ACTIONS } from "../../reducers/loaderReducer";
import EntityEditFormModal from "./EntityEditFormModal";

export const INITIAL_STATE = {
    entities: {},
    properties: {},
    propertiesSelected: {},
    status: {},
};

const EntityEdit = () => {
    const { id } = useParams();
    const changeId = useRef(0);
    const [init, setInit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [state, dispatch] = useReducer(entityReducer, INITIAL_STATE);
    const entity = Array.from(state.entities).find((e) => e.id == id);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { loaderDispatch, toast } = useRootContext();
    // console.log(state.propertiesSelected)

    const move = (fromIndex, toIndex) =>
        dispatch({ action: ENTITY_ACTIONS.MOVE_PROPERTY, fromIndex, toIndex });

    const find = (_id) =>
        Array.from(state.propertiesSelected).findIndex(
            (entity) => entity.id == _id
        );

    useEffect(() => {
        fetch(CONFIG.api + CONFIG.endpointEntityList)
            .then((res) => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    dispatch({
                        action: ENTITY_ACTIONS.LOAD,
                        entities: result.modules,
                        properties: result.items,
                        propertiesSelected: result.items.filter(
                            (item) => item.moduleId == id
                        ),
                        status: result.modules_status,
                    });
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
    }, [init, id]);
    //    const add = (type, parent) => dispatch({ action: ENTITY_ACTIONS.ADD, type, parent });

    useEffect(() => {
        console.log("xxx-other");
    }, [state]);

    async function postData(url = "", data = {}) {
        loaderDispatch({ action: LOADER_ACTIONS.SHOW });
        // Default options are marked with *
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        loaderDispatch({ action: LOADER_ACTIONS.HIDE });
        const result = await response.json();
        if ("message" in result) {
            if ("code" in result && result.code.toString().substring(0, 1) === "2") {
                toast.success(result.message);
            } else if (
                "code" in result &&
                result.code.toString().substring(0, 1) === "4"
            ) {
                toast.error(result.message);
            } else {
                toast(result.message);
            }
        }
        return result; // parses JSON response into native JavaScript objects
    }

    const sendForm = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        let object = {};
        data.forEach(function (value, key) {
            object[key] = value;
        });

        await postData(CONFIG.api + CONFIG.endpointEntityEdit, object);
        setInit(!init);

        return false;
    };

    const sendItemsForm = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        let object = {};
        data.forEach(function (value, key) {
            object[key] = value;
        });

        await postData(CONFIG.api + CONFIG.endpointEntityItemsEdit, object);
        setInit(!init);
        return false;
    };

    const handleOpenModal = (id) => {
        changeId.current = id;
        setModalIsOpen(true);
    };

    const closeModal = () => {
        changeId.current = null;
        setModalIsOpen(false);
    };

    const changPropertiesSelectedObjId = (obj) => {
        closeModal();
        dispatch({
            action: ENTITY_ACTIONS.CHANGE_PROPERTY,
            obj,
        });
    };

    const handleDelete = (entityId) => {
        dispatch({
            action: ENTITY_ACTIONS.DELETE_PROPERTY,
            entityId,
        });
    };

    return (
        <EntityContextProvider
            value={{
                ...state,
                dispatch,
                find,
                move,
                changPropertiesSelectedObjId,
                id: changeId.current,
            }}
        >
            {loading ? (
                <p>Načítání ...</p>
            ) : Array.from(state.propertiesSelected).length === 0 ? (
                <p>žádná položka</p>
            ) : (
                <div>
                    <form onSubmit={sendForm} className="card border-0 shadow">
                        <input type="hidden" name="id" defaultValue={entity.id} />
                        <div className="card-header border-bottom d-flex align-items-center justify-content-between">
                            <h2 className="fs-5 fw-bold mb-0">Nastavení entity</h2>
                            <button type="submit" className="btn btn-primary">
                                Uložit
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <label htmlFor="entity-name">Název</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={entity.name}
                                    className="form-control"
                                    id="entity-name"
                                    required
                                />
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-4">
                                        <label htmlFor="entity-slugSingular">
                                            Slug - jednotné číslo
                                        </label>
                                        <input
                                            type="text"
                                            name="slugSingular"
                                            defaultValue={entity.slugSingular}
                                            className="form-control"
                                            id="entity-slugSingular"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="mb-4">
                                        <label htmlFor="entity-slugPluralr">
                                            Slug - množné číslo
                                        </label>
                                        <input
                                            type="text"
                                            name="slugPlural"
                                            defaultValue={entity.slugPlural}
                                            className="form-control"
                                            id="entity-slugPlural"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="entity-icon">Ikonka</label>
                                <input
                                    type="text"
                                    name="icon"
                                    defaultValue={entity.icon}
                                    className="form-control"
                                    id="entity-icon"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        name="inMenu"
                                        type="checkbox"
                                        id="entity-inMenu"
                                        defaultChecked={entity.inMenu}
                                    />
                                    <label className="form-check-label" htmlFor="entity-inMenu">
                                        Zobrazit v menu
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={sendItemsForm} className="card border-0 mt-4 shadow">
                        <input type="hidden" name="moduleId" defaultValue={entity.id} />
                        <input
                            type="hidden"
                            name="count"
                            defaultValue={Array.from(state.propertiesSelected).length}
                        />
                        <div className="card-header border-bottom d-flex align-items-center justify-content-between">
                            <h2 className="fs-5 fw-bold mb-0">Pole</h2>
                            <button type="submit" className="btn btn-primary">
                                Uložit
                            </button>
                        </div>
                        <div className="card-body">
                            <DndProvider backend={HTML5Backend}>
                                <div className={"gephart-generator-entity-list"}>
                                    <div className="table-responsive">
                                        <div className="table table-centered table-nowrap mb-0 rounded">
                                            <header className="thead-light p-2">
                                                <ul className="entity__items list-group justify-content-between flex-row ">
                                                    <li className="list-group-item w-25 ps-5">Název</li>
                                                    <li className="list-group-item w-25 ps-5">Slug</li>
                                                    <li className="list-group-item w-25 ps-5">Typ</li>
                                                    <li className="list-group-item w-25 ps-5">Akce</li>
                                                </ul>
                                            </header>
                                            {Array.from(state.propertiesSelected).map((item, key) => (
                                                <>
                                                    <EntityDraggableElement
                                                        id={item.id}
                                                        key={item.id}
                                                        index={key}
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name={"id[" + key + "]"}
                                                            value={item.id}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name={"sort[" + key + "]"}
                                                            value={key}
                                                        />
                                                        <ul className="list-group justify-content-between flex-row">
                                                            <li className="list-group-item w-25">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    name={"name[" + key + "]"}
                                                                    value={item.name}
                                                                    className="form-control"
                                                                    id={"property-name_" + key}
                                                                />
                                                            </li>
                                                            <li className="list-group-item w-25">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    name={"slug[" + key + "]"}
                                                                    value={item.slug}
                                                                    className="form-control"
                                                                    id={"property-slug_" + key}
                                                                />
                                                            </li>
                                                            <li className="list-group-item w-25">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    name={"type[" + key + "]"}
                                                                    value={item.type}
                                                                    className="form-control"
                                                                    id={"property-type_" + key}
                                                                />
                                                            </li>
                                                            <li className="list-group-item w-25 d-flex justify-content-around">
                                                                <button
                                                                    className="btn btn-sm btn-primary mx-1"
                                                                    onClick={() => handleOpenModal(item.id)}
                                                                    type="button"
                                                                >
                                                                    Upravit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        window.confirm("Opravdu smazat?") &&
                                                                        handleDelete(item.id)
                                                                    }
                                                                    className="btn btn-sm btn-danger mx-1"
                                                                    type="button"
                                                                >
                                                                    Smazat
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </EntityDraggableElement>
                                                </>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={"gephart-generator-entity-item-wrap"}>
                                        <button
                                            onClick={() =>
                                                dispatch({
                                                    action: ENTITY_ACTIONS.ADD_PROPERTY,
                                                    entityId: id,
                                                })
                                            }
                                            type="button"
                                            className={"btn btn-secondary"}
                                        >
                                            Přidat
                                        </button>
                                    </div>
                                </div>
                            </DndProvider>
                        </div>
                    </form>

                    {modalIsOpen && (
                        <EntityEditFormModal
                            setModalIsOpen={setModalIsOpen}
                            id={changeId.current}
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                        />
                    )}
                </div>
            )}
        </EntityContextProvider>
    );
};

export default EntityEdit;
