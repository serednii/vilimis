import React, {useCallback, useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import TasksKanbanItem from "./TasksKanbanItem";
import TasksListItem from "./TasksListItem";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import TasksKanbanColumn from "./TasksKanbanColumn";
import update from 'immutability-helper'
import TaskFormModal from "./TaskFormModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TasksKanbanSettingsModal from "./TasksKanbanSettingsModal";
import {Gear, Plus} from "@phosphor-icons/react";

const TasksKanban = ({}) => {
    const {API} = useRootContext()
    const [tasks, setTasks] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);

    const defaultSettingsLocal = localStorage.getItem("tasks_kanban_settings");
    const defaultSettings = defaultSettingsLocal ? JSON.parse(defaultSettingsLocal) : {
        showArchived: false,
        showClosed: false,
        showTaskStatuses: null
    };

    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        if (settings.showTaskStatuses === null && taskStatuses?.length > 0) {
            settings.showTaskStatuses = taskStatuses.map((taskStatus)=>taskStatus.id);
        }
        localStorage.setItem("tasks_kanban_settings", JSON.stringify(settings));
    }, [settings]);


    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [modalTaskId, setModalTaskId] = React.useState(0);

    function closeModal() {
        setIsOpen(false);
    }

    function closeSettingsModal() {
        setIsSettingsOpen(false);
    }

    useEffect(() => {
        if (!reload) return;

        API.getData("/taskStatus/list?order=priority%20DESC", (taskStatuses) => {
            setTaskStatuses(taskStatuses);

            if (taskStatuses && taskStatuses.length > 0) {
                let url = "/task/list?order=priority";
                if (!settings.showArchived) {
                    url += "&filter_or_null[archived]=0";
                }
                if (!settings.showClosed) {
                    url += "&filter_or_null[closed]=0";
                }
                API.getData(url, (tasks) => {
                    let taskSorted = {};

                    if (tasks && tasks.length > 0) {
                        taskStatuses.forEach(taskStatus => {
                            taskSorted[taskStatus.id] = tasks.filter(task => task.taskStatusId == taskStatus.id)
                        })
                    }

                    setTasks(taskSorted)
                });
            }
        });

        API.getData("/client/list", (clients) => {
            setClients(clients);
        });
        API.getData("/project/list", (projects) => {
            setProjects(projects);
        });
        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);
        });

        setReload(false);
    }, [reload]);


    const moveCard = (dragIndex, hoverIndex, taskStatusId, hoverTaskStatusId) => {
        if (!taskStatusId) {
            return;
        }

        if (taskStatusId == hoverTaskStatusId) {
            setTasks((prevCards) => {
                    prevCards[taskStatusId] = update(prevCards[taskStatusId], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards[taskStatusId][dragIndex]],
                        ]
                    })

                    let formData = new FormData;
                    prevCards[taskStatusId].forEach((card, index) => {
                        formData.append("tasks[id][]", card.id);
                        formData.append("tasks[priority][]", index);
                        formData.append("tasks[taskStatusId][]", taskStatusId);
                    });
                    API.postData("/taskPriority/save", formData);

                    return prevCards;
                }
            )
        } else if (taskStatusId > 0) {
            setTasks((prevCards) => {
                let newCard = prevCards[taskStatusId][dragIndex];
                newCard.taskStatusId = hoverTaskStatusId;

                prevCards[taskStatusId] = update(prevCards[taskStatusId], {
                    $splice: [
                        [dragIndex, 1]
                    ]
                });

                prevCards[hoverTaskStatusId] = update(prevCards[hoverTaskStatusId], {
                    $splice: [
                        [hoverIndex, 0, newCard],
                    ]
                });

                let formData = new FormData;
                prevCards[taskStatusId].forEach((card, index) => {
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[priority][]", index);
                    formData.append("tasks[taskStatusId][]", taskStatusId);
                });
                prevCards[hoverTaskStatusId].forEach((card, index) => {
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[priority][]", index);
                    formData.append("tasks[taskStatusId][]", hoverTaskStatusId);
                });

                API.postData("/taskPriority/save", formData);

                return prevCards;
            });
        }
        setReload((prev) => prev + 1);

    };

    if (!taskStatuses || taskStatuses.length === 0) {
        return ("...");
    }

    return (
        <>

            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Úkoly</h1></div>
            </div>

            <div className="my-3">
                <div className="row">
                    <div className="col-6">
                        <button onClick={() => setIsOpen(true)}
                                className="btn btn-secondary d-inline-flex align-items-center me-2">
                            <Plus size={16} className="me-2"/>
                            Nový úkol
                        </button>
                    </div>
                    <div className="col-6 text-end">
                        <div className="btn-group">
                            <button onClick={() => setIsSettingsOpen(true)}
                                    className="btn btn-gray-800">
                                <Gear size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="container-fluid kanban-container py-4 px-0">
                    <div className="row d-flex flex-nowrap">
                        {taskStatuses.filter(taskStatus=>settings.showTaskStatuses?.includes(taskStatus.id)).map((taskStatus, taskStatus_index) => (
                            <TasksKanbanColumn key={taskStatus.id}
                                               setReload={setReload}
                                               tasks={tasks[taskStatus.id]}
                                               taskStatus={taskStatus}
                                               clients={clients}
                                               endCustomers={endCustomers}
                                               projects={projects}
                                               moveCard={moveCard}/>
                        ))}
                    </div>
                </div>
            </DndProvider>

            {modalIsOpen && (
                <TaskFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={() => setReload(true)}/>
            )}

            {modalIsSettingsOpen && (
                <TasksKanbanSettingsModal
                    isOpen={modalIsSettingsOpen}
                    onRequestClose={closeSettingsModal}
                    setIsOpen={setIsSettingsOpen}
                    callback={() => setReload(true)}
                    settings={settings}
                    setSettings={setSettings}
                    taskStatuses={taskStatuses}
                    id={modalTaskId}/>
            )}
        </>
    );
};

export default TasksKanban;