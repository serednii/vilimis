// noinspection HtmlUnknownAttribute

import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import {Calendar, Gear, Plus, Trash} from "@phosphor-icons/react";
import TaskFormModal from "./TaskFormModal";
import TasksKanbanSettingsModal from "./TasksKanbanSettingsModal";
import TasksListSettingsModal from "./TasksListSettingsModal";
import TaskUtils from "../../utils/TaskUtils";
import BudgetCalculator from "../../utils/BudgetCalculator";
import TimeTracker from "../TimeTracer/TimeTracker";

const TasksList = ({projectId}) => {
    const {API} = useRootContext()
    const [tasks, setTasks] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [reload, setReload] = useState(true);
    const [endCustomers, setEndCustomers] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState(0);
    const localStorageKey = "tasks_list_settings" + (projectId ? ("_project_" + projectId) : "")

    const defaultSettingsLocal = localStorage.getItem(localStorageKey);
    const defaultSettings = defaultSettingsLocal ? JSON.parse(defaultSettingsLocal) : {
        showArchived: false,
        showClosed: false,
        showTaskStatuses: null
    };

    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        if (settings.showTaskStatuses === null && taskStatuses?.length > 0) {
            settings.showTaskStatuses = taskStatuses.map((taskStatus) => taskStatus.id);
        }
        localStorage.setItem(localStorageKey, JSON.stringify(settings));
    }, [settings, taskStatuses]);

    useEffect(() => {
        if (!reload) return;

        setTasksLoading(true);

        API.getData("/taskStatus/list?order=priority%20ASC", (taskStatuses) => {
            setTaskStatuses(taskStatuses);

            let url = "/task/list?order=dead_line_date";
            if (projectId) {
                url += "&filter[project_id]=" + projectId;
            }
            if (!settings.showArchived) {
                url += "&filter_or_null[archived]=0";
            }
            if (!settings.showClosed) {
                url += "&filter_or_null[closed]=0";
            }
            API.getData(url, (tasks) => {
                let taskSorted = {};
                setTasks(tasks);
            });
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

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [modalTaskId, setModalTaskId] = React.useState(0);

    function closeModal() {
        setIsOpen(false);
    }

    function closeSettingsModal() {
        setIsSettingsOpen(false);
    }

    function handleDelete(id, noreload) {
        API.getData("/task/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    if (tasksLoading) {
        return ("Načítání...");
    }

    let taskUtil = null;
    let budgetUtil = null;

    const handleBulkAction = () => {
        switch (bulkAction) {
            case "delete":
                selectedIds.forEach(id => {
                    handleDelete(id, true)
                });
                setReload(true);
                break;
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Úkoly</h1></div>
            </div>


            <div className="my-3">
                <div className="row">
                    <div className="col-6">
                        <button onClick={() => {setIsOpen(true); setModalTaskId(null);}}
                                className="btn btn-secondary d-inline-flex align-items-center me-2">
                            <Plus size={16} className="me-2"/>
                            Nový úkol
                        </button>
                    </div>
                    <div className="col-6 text-end">
                        <div className="btn-group">
                            <button onClick={() => setIsSettingsOpen(true)}
                                    className="btn btn-link">
                                <Gear size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {tasks?.length > 0 ? (
                <>
                    <div className="d-flex mb-3"><select className="form-select fmxw-200"
                                                         disabled={selectedIds.length === 0}
                                                         defaultValue=""
                                                         onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Hromadná akce</option>
                        <option value="delete">Smazat</option>
                    </select>
                        <button disabled={selectedIds.length === 0}
                                onClick={handleBulkAction}
                                className="btn btn-sm px-3 btn-secondary ms-3">Provést
                        </button>
                    </div>

                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table class="table table-hover align-items-center">
                                    <thead>
                                    <tr>
                                        <td style={{maxWidth: "15px", width: "15px", minWidth: "15px"}}
                                            className="p-0 ps-2 border-bottom">
                                            <div className="form-check dashboard-check">
                                                <input className="form-check-input" type="checkbox" id="item_all"
                                                       onClick={(e) => {
                                                           if (e.target.checked) {
                                                               setSelectedIds((prev) => [...tasks.map((task) => task.id)]);
                                                           } else {
                                                               setSelectedIds((prev) => []);
                                                           }
                                                       }}
                                                />
                                                <label className="form-check-label" htmlFor="item_all"/>
                                            </div>
                                        </td>
                                        <th class="border-bottom">Název</th>
                                        {!projectId && (
                                            <th className="border-bottom">Projekt</th>
                                        )}
                                        <th class="border-bottom">Termín</th>
                                        <th class="border-bottom">Stav</th>
                                        <th class="border-bottom">Proces</th>
                                        <th class="border-bottom">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tasks.filter(task=>(
                                        (settings?.showTaskStatuses?.length>0 && settings?.showTaskStatuses?.includes(task.taskStatusId))||settings?.showTaskStatuses?.length===0||!task.taskStatusId
                                    )).map((task, task_key) => (
                                        <tr key={task_key}>
                                            {(taskUtil = new TaskUtils(task, taskStatuses, projects, clients, endCustomers)) && ""}
                                            {(budgetUtil = new BudgetCalculator(task.spendingTime, task)) && ""}

                                            <td className="p-0 ps-2">
                                                <div className="form-check dashboard-check">
                                                    <input className="form-check-input" type="checkbox"
                                                           id={"item_" + task.id}
                                                           checked={selectedIds.includes(task.id)}
                                                           onClick={(e) => {
                                                               if (e.target.checked) {
                                                                   setSelectedIds((prev) => [...prev, task.id]);
                                                               } else {
                                                                   setSelectedIds((prev) => prev.filter((id) => id != task.id));
                                                               }
                                                           }}
                                                           />
                                                    <label className="form-check-label" htmlFor={"item_" + task.id}/>
                                                </div>
                                            </td>
                                            <td className="fw-bold  text-wrap">

                                                <div className="d-flex align-items-center">

                                                    <div>
                                                    <TimeTracker taskId={task.id} />
                                                    </div>

                                                    <div>
                                                    <a onClick={() => {
                                                        setModalTaskId(task.id);
                                                        setIsOpen(true)
                                                    }}
                                                       className="text-primary fw-bold">
                                                        {task.name}
                                                    </a>
                                                    </div>
                                                </div>
                                            </td>
                                            {!projectId && (
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {taskUtil.isImg ? (
                                                            <div className="me-2">
                                                                <img src={taskUtil.imgUrl}
                                                                     style={{maxWidth: "100px", maxHeight: "50px"}}/>

                                                            </div>
                                                        ) : (
                                                            <div className="d-block">
                                                                <span
                                                                    className="fw-bold">{taskUtil.project?.name}</span>
                                                                <div
                                                                    className="small text-gray">{taskUtil.endCustomer?.name}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                            <td><span class="fw-normal">{taskUtil.deadLineDateFormated}</span></td>
                                            <td><span class="fw-normal"
                                            style={taskUtil.taskStatus?.color != "" ? {color: taskUtil.taskStatus?.color} : {}}
                                            >{taskUtil.taskStatus?.name}</span>
                                            </td>
                                            <td>

                                                <div className="progress-wrapper">
                                                    <div className="progress-info">
                                                        <div
                                                            className="h6 mb-0">{task.spendingTime ? (budgetUtil.calculareSpendingHoursNicely()) : "00:00"}</div>
                                                        <div className="small fw-bold text-gray-500">
                                                            <span>{task.hourBudget} hod.</span></div>
                                                    </div>
                                                    <div className="progress mb-0">
                                                        <div className="progress-bar bg-success" role="progressbar"
                                                             aria-valuenow={budgetUtil.calculareSpendingPercent()}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: budgetUtil.calculareSpendingPercent() + "%"}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(task.id)}
                                                    className="btn btn-sm btn-link" type="button">
                                                    <Trash/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>Zatím žádný úkol</p>
            )}

            {modalIsOpen && (
                <TaskFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    projectId={projectId}
                    id={modalTaskId}
                    callback={() => setReload(true)}/>
            )}

            {modalIsSettingsOpen && (
                <TasksListSettingsModal
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

export default TasksList;