import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";

const TasksList = ({}) => {
    const {API} = useRootContext()
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        API.getData("/task/list", (tasks) => {
            setTasks(tasks);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/task/delete/"+id, ()=>{
            API.getData("/task/list", (tasks) => {
                setTasks(tasks);
            });
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Úkoly</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/tasks/new" className="btn btn-primary" type="button">Nový úkoly</NavLink>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0 rounded">
                            <thead className="thead-light">
                            <tr>
                                <th className="border-0 rounded-start">#</th>
                                <th className="border-0">Název</th>
                                <th className="border-0">Hodinový rozpočet</th>
                                <th className="border-0">Projekt</th>
                                <th className="border-0 rounded-end">Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks && tasks.length && tasks.map((task, task_key) => (
                                <tr key={task_key}>
                                    <td><NavLink to={"/tasks/edit/"+task.id} className="text-primary fw-bold">{task.id}</NavLink></td>
                                    <td className="fw-bold ">
                                        {task.name}
                                    </td>
                                    <td> {task.hourBudget}</td>
                                    <td> {task.projectId}</td>
                                    <td>
                                        <NavLink to={"/tasks/edit/"+task.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        <button
                                            onClick={()=> window.confirm("Opravdu smazat?") && handleDelete(task.id)}
                                            className="btn btn-sm btn-danger" type="button">Smazat</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TasksList;