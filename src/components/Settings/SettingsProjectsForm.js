import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import update from "immutability-helper";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {heightBetweenCursorAndMiddle} from "../../utils";
import SettingsProjectsFormProjectStatusItem from "./SettingsProjectsFormProjectStatusItem";
import {Plus} from "@phosphor-icons/react";
import ProjectFormModal from "../Projects/ProjectFormModal";
import ProjectStatusFormModal from "../ProjectStatuses/ProjectStatusFormModal";

const SettingsProjectsForm = ({}) => {
    const {API} = useRootContext()
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [reload, setReload] = useState(true);
    const [projectStatusesLoading, setProjectStatusesLoading] = useState(false);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalProjectStatusId, setModalProjectStatusId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;
        setProjectStatusesLoading(true);

        loadProjectStatuses();

        setProjectStatusesLoading(false);
        setReload(false);
    }, [reload]);

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleDelete(id, noreload) {
        API.getData("/projectStatus/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    function loadProjectStatuses() {
        API.getData("/projectStatus/list?order=priority", (projectStatuses) => {
            setProjectStatuses(projectStatuses);
        });
    }

    const moveCard = (dragIndex, hoverIndex) => {
        setProjectStatuses((prevCards) => {
                prevCards = update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ]
                })

                let formData = new FormData;
                prevCards.forEach((card, index) => {
                    formData.append("projectStatuses[id][]", card.id);
                    formData.append("projectStatuses[priority][]", index);
                });
                API.postData("/projectStatusPriority/save", formData, () => {
                    setReload((prev) => prev + 1);
                });

                return prevCards;
            }
        )

    };


    if (projectStatusesLoading) {
        return (<>Načítaní..</>)
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-8">
                    <h2 className="h5 mb-3">Stavy projektů</h2>

                    <p>
                        <button onClick={() => {
                            setModalProjectStatusId(null);
                            setModalIsOpen(true)
                        }}
                                className="btn btn-secondary d-inline-flex align-items-center me-2">
                            <Plus size={16} className="me-2"/>
                            Nový stav projektu
                        </button>
                    </p>

                    {projectStatuses && projectStatuses?.length > 0 && (
                        <DndProvider backend={HTML5Backend}>
                            {projectStatuses.map((projectStatus, index) => (
                                <SettingsProjectsFormProjectStatusItem
                                    projectStatus={projectStatus}
                                    id={projectStatus.id}
                                    index={index}
                                    key={projectStatus.id + "-" + index}
                                    moveCard={moveCard}
                                    handleDelete={handleDelete}
                                    setModalIsOpen={setModalIsOpen}
                                    setModalProjectStatusId={setModalProjectStatusId}
                                />
                            ))}
                        </DndProvider>
                    )}
                </div>
            </div>
            {modalIsOpen && (
                <ProjectStatusFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setModalIsOpen}
                    id={modalProjectStatusId}
                    callback={() => setReload(true)}/>
            )}</>
    );
}

export default SettingsProjectsForm;