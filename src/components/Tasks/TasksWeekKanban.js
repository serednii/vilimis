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
import {AlignLeft, ArrowLeft, ArrowRight, Calendar, Gear, Kanban, Plus} from "@phosphor-icons/react";
import TasksWeekKanbanColumn from "./TasksWeekKanbanColumn";
import TasksWeekKanbanSettingsModal from "./TasksWeekKanbanSettingsModal";
import WeekSetter from "../_dates/WeekSetter";

const TasksWeekKanban = ({}) => {
    const {API, locale} = useRootContext()
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(new Date());
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);

    const defaultSettingsLocal = localStorage.getItem("tasks_week_kanban_settings");
    const defaultSettings = defaultSettingsLocal ? JSON.parse(defaultSettingsLocal) : {
        showArchived: false,
        showClosed: false,
        showSatSun: true
    };

    const [settings, setSettings] = useState(defaultSettings);


    const day = date.getDay();
    const date_monday = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(structuredClone(date).setDate(date_monday));
    const days = [...Array(settings.showSatSun ? 7 : 5).keys()];
    const dates = [];
    days.forEach(day => {
        dates.push(new Date(structuredClone(date).setDate(date_monday + day)));
    });


    useEffect(() => {
        localStorage.setItem("tasks_week_kanban_settings", JSON.stringify(settings));
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

        setTasksLoading(true);

        let url = "/task/list?order=planned_priority";
        if (!settings.showArchived) {
            url += "&filter_or_null[archived]=0";
        }
        if (!settings.showClosed) {
            url += "&filter_or_null[closed]=0";
        }
        API.getData(url, (tasks) => {
            let taskSorted = {};

            days.forEach(day => {
                taskSorted[day] = [];
            })

            taskSorted[-1] = [];

            if (tasks && tasks.length > 0) {
                tasks.map(task => {
                    if (task.plannedDate && "date" in task.plannedDate) {

                        days.forEach(day => {
                            if (dates[day].toISOString().substring(0, 10) === task.plannedDate.date.substring(0, 10)) {
                                taskSorted[day].push(task);
                            }
                        })
                    } else {
                        taskSorted[-1].push(task);
                    }
                });

            }

            setTasks(taskSorted)
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

        setTasksLoading(false);
        setReload(false);
    }, [reload]);


    const moveCard = (dragIndex, hoverIndex, plannedDate, hoverPlannedDate) => {
        if (plannedDate < -1) {
            return;
        }

        if (plannedDate == hoverPlannedDate) {
            console.log(plannedDate);
            setTasks((prevCards) => {
                    prevCards[plannedDate] = update(prevCards[plannedDate], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards[plannedDate][dragIndex]],
                        ]
                    })

                    let formData = new FormData;
                    console.log(plannedDate);
                    prevCards[plannedDate].forEach((card, index) => {
                        formData.append("tasks[id][]", card.id);
                        formData.append("tasks[planned_priority][]", index + 1);
                        formData.append("tasks[planned_date][]", plannedDate > -1 ? dates[plannedDate].toISOString().substring(0, 10) : 0);
                    });
                    API.postData("/taskPlannedDate/save", formData, ()=>{
                        setReload((prev) => prev + 1);
                    });

                    return prevCards;
                }
            )
        } else if (plannedDate > -2) {
            setTasks((prevCards) => {
                let newCard = prevCards[plannedDate][dragIndex];

                newCard.plannedDate = hoverPlannedDate > -1 ? {date:dates[hoverPlannedDate].toISOString()} : null;

                prevCards[plannedDate] = update(prevCards[plannedDate], {
                    $splice: [
                        [dragIndex, 1]
                    ]
                });

                prevCards[hoverPlannedDate] = update(prevCards[hoverPlannedDate], {
                    $splice: [
                        [hoverIndex, 0, newCard],
                    ]
                });

                let formData = new FormData;
                prevCards[plannedDate].forEach((card, index) => {
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[planned_priority][]", index + 1);
                    formData.append("tasks[planned_date][]", plannedDate > -1 ? dates[plannedDate].toISOString().substring(0, 10) : 0);
                });
                prevCards[hoverPlannedDate].forEach((card, index) => {
                    formData.append("tasks[id][]", card.id);
                    formData.append("tasks[planned_priority][]", index + 1);
                    formData.append("tasks[planned_date][]", hoverPlannedDate > -1 ? dates[hoverPlannedDate].toISOString().substring(0, 10) : 0);
                });

                API.postData("/taskPlannedDate/save", formData, ()=>{
                    setReload((prev) => prev + 1);
                });

                return prevCards;
            });
        }

    };

    if (tasksLoading) {
        return ("Načítání...");
    }

    return (
        <>

            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0">
                    <h1 className="h4">Úkoly - týdenní plán:&nbsp;
                        <WeekSetter onChange={(newDate)=>{setDate(newDate);setReload(true);}}/>
                    </h1>
                </div>
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
                            <NavLink to="/tasks"
                                     className="btn btn-gray-800">
                                <Kanban size={16}/>
                            </NavLink>
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
                        <TasksWeekKanbanColumn
                            setReload={setReload}
                            tasks={tasks[-1]}
                            clients={clients}
                            day={-1}
                            endCustomers={endCustomers}
                            projects={projects}
                            moveCard={moveCard}/>

                        {days.map((day, index) => (
                            <TasksWeekKanbanColumn
                                key={index+date.toISOString()}
                                setReload={setReload}
                                tasks={tasks[day]}
                                day={day}
                                date={dates[day]}
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
                <TasksWeekKanbanSettingsModal
                    isOpen={modalIsSettingsOpen}
                    onRequestClose={closeSettingsModal}
                    setIsOpen={setIsSettingsOpen}
                    callback={() => setReload(true)}
                    settings={settings}
                    setSettings={setSettings}
                    days={days}
                    id={modalTaskId}/>
            )}
        </>
    );
};

export default TasksWeekKanban;