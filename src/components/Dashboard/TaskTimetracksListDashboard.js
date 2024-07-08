import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import { NavLink } from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import TimeTrackerItem from "../TimeTracer/TimeTrackerItem";
import {Eye} from "@phosphor-icons/react";

const TaskTimetracksListDashboard = ({ }) => {
    const { API } = useRootContext()
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
                className="fs-6 fw-bold mb-0">Záznamy času</h2>
                <div className="ms-auto small">
                    <NavLink to="/time-tracks" className="fw-normal d-inline-flex align-items-center" href="#">

                        <Eye className="me-2"/>
                        Zobrazit vše</NavLink></div>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush list-group-timeline">
                    {taskTimetracks && taskTimetracks.length > 0 && taskTimetracks.map((taskTimetrack, taskTimetrack_index) => (

                        "taskId" in taskTimetrack && taskTimetrack.taskId && tasks.filter(task => task.id === taskTimetrack.taskId).map((task, task_index) => (

                            <div key={taskTimetrack_index + "-" + taskTimetrack.id} className="list-group-item border-0 pb-4">
                                {(!beforeTaskTimetrack || beforeTaskTimetrack.taskId != taskTimetrack.taskId) && (
                                    <div className="mb-3">
                                        <TasksListItem
                                            task={task}
                                            projects={projects}
                                            endCustomers={endCustomers}
                                            clients={clients}
                                            onUpdate={() => setReload(true)} />
                                    </div>
                                )}
                                <TimeTrackerItem taskTimetrack={taskTimetrack} onChange={() => setReload(true)} />
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