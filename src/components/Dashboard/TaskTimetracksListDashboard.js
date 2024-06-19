import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import TimeTrackerItem from "../TimeTracer/TimeTrackerItem";

const TaskTimetracksListDashboard = ({}) => {
    const {API} = useRootContext()
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [taskTimetracks, setTaskTimetracks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);

    useEffect(() => {
        if (!reload) return;

        API.getData("/taskTimetrack/list", (taskTimetracks) => {
            setTaskTimetracks(taskTimetracks);
        });
        API.getData("/task/list", (tasks) => {
            setTasks(tasks);
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

    let beforeTaskTimetrack = null;

    return (
        <div className="card notification-card border-0 shadow">
            <div className="card-header d-flex align-items-center"><h2
                className="fs-5 fw-bold mb-0">Záznamy času</h2>
                <div className="ms-auto">
                    <NavLink to="/tasks" className="fw-normal d-inline-flex align-items-center" href="#">
                        <svg className="icon icon-xxs me-2" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"></path>
                        </svg>
                        Zobrazit všechny</NavLink></div>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush list-group-timeline">
                    {taskTimetracks && taskTimetracks.length > 0 && taskTimetracks.map((taskTimetrack, taskTimetrack_index) => (

                        "taskId" in taskTimetrack && taskTimetrack.taskId && tasks.filter(task => task.id === taskTimetrack.taskId).map((task, task_index) => (

                        <div key={taskTimetrack_index+"-"+taskTimetrack.id} className="list-group-item border-0 pb-4">
                            {(!beforeTaskTimetrack || beforeTaskTimetrack.taskId != taskTimetrack.taskId) && (
                                <div className="mb-3">
                                    <TasksListItem
                                        task={task}
                                        projects={projects}
                                        endCustomers={endCustomers}
                                        clients={clients}
                                        onUpdate={() => setReload(true)}/>
                                </div>
                            )}
                            <TimeTrackerItem taskTimetrack={taskTimetrack} onChange={()=>setReload(true)}/>
                            {(beforeTaskTimetrack = taskTimetrack) && ""}
                        </div>

                        ))
                    ))}
                </div>
            </div>
        </div>
    );

};

export default TaskTimetracksListDashboard;