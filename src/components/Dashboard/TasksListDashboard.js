import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";

const TasksListDashboard = ({}) => {
    const {loaderDispatch, toast, API} = useRootContext()
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    let tasksWithDeadLine = [];
    let tasksWithoutDeadLine = [];
    let tasksSorted = [];
    let dateP1 = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    let dateP2 = new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000);
    let dateP7 = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
    let dateP31 = new Date((new Date()).getTime() + 31 * 24 * 60 * 60 * 1000);
    let isImg = false;

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

    if (tasks && tasks.length > 1) {
        tasksWithDeadLine = tasks.filter(task => "deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate);
        tasksWithoutDeadLine = tasks.filter(task => !("deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate));

        tasksWithDeadLine = tasksWithDeadLine.sort((a, b) => new Date(a.deadLineDate.date) - new Date(b.deadLineDate.date));
    }

    tasksSorted = tasksWithDeadLine.concat(tasksWithoutDeadLine);

    return (
        <div className="card notification-card border-0 shadow">
            <div className="card-header d-flex align-items-center"><h2
                className="fs-5 fw-bold mb-0">Úkoly</h2>
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
                    {tasksSorted && tasksSorted.length > 0 && tasksSorted.map((task, task_index) => (
                        <div key={task_index} className="list-group-item border-0">
                            <div role="presentation" onClick={()=>{setModalTaskId(task.id);setIsOpen(true)}} className="row ps-lg-1" style={{cursor:"pointer"}}>
                                <div className="col-auto">
                                    <div className="icon-shape icon-xs icon-shape-primary rounded p-1"
                                         style={{width: "5rem"}}>
                                        {isImg = false}
                                        {"projectId" in task && task.projectId && projects.filter(project => project.id === task.projectId).map((project, project_index) => (
                                            <React.Fragment key={project_index}>

                                                {"endCustomerId" in project && project.endCustomerId && endCustomers.filter(endCustomer => endCustomer.id === project.endCustomerId).map((endCustomer, endCustomer_index) => (
                                                    endCustomer.logo && (
                                                        <React.Fragment key={endCustomer_index}>
                                                            <img src={CONFIG.uploadDir + endCustomer.logo}/>
                                                            {isImg = true}
                                                        </React.Fragment>
                                                    )
                                                ))}
                                                {!isImg && "clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                                    <React.Fragment key={client_index}>
                                                        <img src={CONFIG.uploadDir + client.logo}/>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                <div className="col ms-n2">
                                    <h3 className="fs-6 fw-bold mb-1">{task.name}</h3>
                                    <p className="mb-0">
                                        {"projectId" in task && task.projectId && projects.filter(project => project.id === task.projectId).map((project, project_index) => (
                                            <React.Fragment key={project_index}>
                                                {project.name}
                                                {"clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                                    <React.Fragment key={client_index}>
                                                        &nbsp;/ {client.name}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                    {"deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate && (
                                        <>
                                            <div className="d-flex align-items-center">
                                                <svg className="icon icon-xxs text-gray-400 me-1"
                                                     fill="currentColor"
                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                          clipRule="evenodd"></path>
                                                </svg>
                                                <span className="small">
                                                            {dateP1 > (new Date(task.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 24 hodin - </span>
                                                            ) : dateP2 > (new Date(task.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 2 dní - </span>
                                                            ) : dateP7 > (new Date(task.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do týdne - </span>
                                                            ) : dateP31 > (new Date(task.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do měsíce hodin - </span>
                                                            ) : ""}
                                                    {(new Date(task.deadLineDate.date)).toLocaleString()}
                                            </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TaskFormModal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                setIsOpen={setIsOpen}
                callback={()=>setReload(true)}
                id={modalTaskId}/>
        </div>
    );

};

export default TasksListDashboard;