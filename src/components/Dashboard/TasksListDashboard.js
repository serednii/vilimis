import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import { NavLink } from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import {Eye} from "@phosphor-icons/react";

const TasksListDashboard = ({ }) => {
    const { API } = useRootContext()
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    let tasksWithDeadLine = [];
    let tasksWithoutDeadLine = [];
    let tasksSorted = [];

    // console.log(tasks)
    // console.log(clients)
    // console.log(projects)
    // console.log(endCustomers)


    useEffect(() => {
        if (!reload) return;

        API.getData("/task/list?filter_or_null[archived]=0&filter_or_null[closed]=0", (tasks) => {
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

    if (tasks && tasks.length > 1) {
        tasksWithDeadLine = tasks.filter(task => "deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate);
        tasksWithoutDeadLine = tasks.filter(task => !("deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate));

        tasksWithDeadLine = tasksWithDeadLine.sort((a, b) => new Date(a.deadLineDate.date) - new Date(b.deadLineDate.date));
    }

    tasksSorted = tasksWithDeadLine.concat(tasksWithoutDeadLine);

    return (
        <div className="card notification-card border-0 shadow">

            <div className="card-header d-flex align-items-center"><h2
                className="fs-6 fw-bold mb-0">Úkoly</h2>
                <div className="ms-auto small">
                    <NavLink to="/tasks" className="fw-normal d-inline-flex align-items-center" href="#">
                        <Eye className="me-2"/>
                        Zobrazit vše</NavLink></div>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush list-group-timeline">
                    {tasksSorted && tasksSorted.length > 0 && tasksSorted.map((task, task_index) => (
                        <div key={task_index} className="list-group-item border-0">
                            <TasksListItem
                                task={task}
                                projects={projects}
                                endCustomers={endCustomers}
                                clients={clients}
                                onUpdate={() => setReload(true)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default TasksListDashboard;