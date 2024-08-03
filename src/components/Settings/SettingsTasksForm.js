import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import update from "immutability-helper";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {heightBetweenCursorAndMiddle} from "../../utils";
import SettingsTasksFormTaskStatusItem from "./SettingsTasksFormTaskStatusItem";
import {Plus} from "@phosphor-icons/react";
import TaskFormModal from "../Tasks/TaskFormModal";
import TaskStatusFormModal from "../TaskStatuses/TaskStatusFormModal";

const SettingsTasksForm = ({}) => {
    const {API} = useRootContext()
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [reload, setReload] = useState(true);
    const [taskStatusesLoading, setTaskStatusesLoading] = useState(false);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalTaskStatusId, setModalTaskStatusId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;
        setTaskStatusesLoading(true);

        loadTaskStatuses();

        setTaskStatusesLoading(false);
        setReload(false);
    }, [reload]);

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleDelete(id, noreload) {
        API.getData("/taskStatus/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    function loadTaskStatuses() {
        API.getData("/taskStatus/list?order=priority", (taskStatuses) => {
            setTaskStatuses(taskStatuses);
        });
    }

    const moveCard = (dragIndex, hoverIndex) => {
        setTaskStatuses((prevCards) => {
                prevCards = update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ]
                })

                let formData = new FormData;
                prevCards.forEach((card, index) => {
                    formData.append("taskStatuses[id][]", card.id);
                    formData.append("taskStatuses[priority][]", index);
                });
                API.postData("/taskStatusPriority/save", formData, () => {
                    setReload((prev) => prev + 1);
                });

                return prevCards;
            }
        )

    };


    if (taskStatusesLoading) {
        return (<>Načítaní..</>)
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-8">
                    <h2 className="h5 mb-3">Stavy úkolů</h2>

                    <p>
                        <button onClick={() => {
                            setModalTaskStatusId(null);
                            setModalIsOpen(true)
                        }}
                                className="btn btn-secondary d-inline-flex align-items-center me-2">
                            <Plus size={16} className="me-2"/>
                            Nový úkol
                        </button>
                    </p>

                    {taskStatuses && taskStatuses?.length > 0 && (
                        <DndProvider backend={HTML5Backend}>
                            {taskStatuses.map((taskStatus, index) => (
                                <SettingsTasksFormTaskStatusItem
                                    taskStatus={taskStatus}
                                    id={taskStatus.id}
                                    index={index}
                                    key={taskStatus.id + "-" + index}
                                    moveCard={moveCard}
                                    handleDelete={handleDelete}
                                    setModalIsOpen={setModalIsOpen}
                                    setModalTaskStatusId={setModalTaskStatusId}
                                />
                            ))}
                        </DndProvider>
                    )}
                </div>
            </div>
            {modalIsOpen && (
                <TaskStatusFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setModalIsOpen}
                    id={modalTaskStatusId}
                    callback={() => setReload(true)}/>
            )}</>
    );
}

export default SettingsTasksForm;