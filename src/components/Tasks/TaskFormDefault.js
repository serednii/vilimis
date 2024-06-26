import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import TaskStatusesSelectList from "../TaskStatuses/TaskStatusesSelectList";

const taskBlank = {
    name: "",
    hourBudget: "",
    projectId: null
}

const TaskFormDefault = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [task, setTask] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedTaskStatusId, setSelectedTaskStatusId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/task/single/" + id, (data) => {
                setTask(data);
            });
        } else {
            setTask(taskBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/task/save", formData, (data) => {
            setTask(data.task);

            if (handleSave) {
                handleSave(data.task);
            }
        });
    }

    if (!task) {
        return (<>Načítaní..</>)
    }

    task.deadLineDateFormated = "";
    if (task && "deadLineDate" in task && task.deadLineDate && "date" in task.deadLineDate) {
        task.deadLineDateFormated = task.deadLineDate.date.substring(0, 16)
    }

    return (
        <>
            {task && "name" in task && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="priority" value={task.priority}/>
                    <input type="hidden" name="spending_time" value={task.spendingTime}/>
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={task.name} type="text" name="name" className="form-control"
                                       id="form_edit_name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_description">Zadání</label>
                                <textarea defaultValue={task.description} className="form-control" name="description"
                                          rows="10"
                                          id="form_edit_description"></textarea>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="mb-3">
                                <label htmlFor="form_edit_project_id">Stav úkolu</label>
                                <TaskStatusesSelectList selected={task.taskStatusId}
                                                        onChange={setSelectedTaskStatusId}/>
                                <input type="hidden" name="task_status_id" value={selectedTaskStatusId}/>
                            </div>


                            <div className="form-check form-switch">
                                <input className="form-check-input"
                                       name="closed"
                                       defaultChecked={task.closed}
                                       type="checkbox"
                                       id="form_edit_closed"/>
                                <label className="form-check-label" htmlFor="form_edit_closed">Uzavřeno</label>
                            </div>

                            <div className="form-check form-switch">
                                <input className="form-check-input"
                                       defaultChecked={task.archived}
                                       name="archived"
                                       type="checkbox"
                                       id="form_edit_archived"/>
                                <label className="form-check-label" htmlFor="form_edit_archived">Archivováno</label>
                            </div>


                            <div className="mb-3">
                                <label htmlFor="form_edit_dead_line_date">Termín</label>
                                <input defaultValue={task.deadLineDateFormated} type="datetime-local"
                                       name="dead_line_date"
                                       className="form-control"
                                       id="form_edit_dead_line_date"></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_hour_budget">Hodinový rozpočet</label>
                                <input defaultValue={task.hourBudget} type="number" name="hour_budget"
                                       className="form-control"
                                       id="form_edit_hour_budget"></input>
                            </div>
                            <hr/>
                            <div className="mb-3">
                                <label htmlFor="form_edit_project_id">Projekt</label>
                                <ProjectsSelectList selected={task.projectId} onChange={setSelectedProjectId}/>
                                <input type="hidden" name="project_id" value={selectedProjectId}/>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default TaskFormDefault;