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

const TasksKanban = ({}) => {
    const {API} = useRootContext()
    const [tasks, setTasks] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);



    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalTaskId, setModalTaskId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (!reload) return;

        API.getData("/taskStatus/list?order=priority%20DESC", (taskStatuses) => {
            setTaskStatuses(taskStatuses);

            if (taskStatuses && taskStatuses.length > 0) {
                API.getData("/task/list?order=priority", (tasks) => {
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
        console.log(dragIndex, hoverIndex, taskStatusId, hoverTaskStatusId);
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
                    prevCards[taskStatusId].forEach((card, index)=>{
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
                prevCards[taskStatusId].forEach((card, index)=>{
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[priority][]", index);
                    formData.append("tasks[taskStatusId][]", taskStatusId);
                });
                prevCards[hoverTaskStatusId].forEach((card, index)=>{
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[priority][]", index);
                    formData.append("tasks[taskStatusId][]", hoverTaskStatusId);
                });

                API.postData("/taskPriority/save", formData);

                return prevCards;
            });
        }
        setReload((prev)=>prev+1);

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
                <button onClick={() => {
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nový úkol</button>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="container-fluid kanban-container py-4 px-0">
                    <div className="row d-flex flex-nowrap">
                        {taskStatuses.map((taskStatus, taskStatus_index) => (
                            <TasksKanbanColumn key={taskStatus.id}
                                               setReloat={setReload}
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
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        callback={()=>setReload(true)}/>
                )}
        </>
    );
};

export default TasksKanban;