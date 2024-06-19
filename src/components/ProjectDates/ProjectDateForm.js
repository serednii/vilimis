import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import TasksSelectList from "../Tasks/TasksSelectList";

const projectDateBlank = {
    name: "",
    color: "",
    priority: "",
    done: false,
    taskId: null,
    date: ''
}

const ProjectDateForm = ({id, handleSave, projectId}) => {
    const {API} = useRootContext()
    const [projectDate, setProjectDate] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/projectDate/single/" + id, (data) => {
                setProjectDate(data);
            });
        } else {
            setProjectDate(projectDateBlank)
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }
        
        formData.append("project_id", projectId);

        API.postData("/projectDate/save", formData, (data) => {
            setProjectDate(data.projectDate);

            if (handleSave) {
                handleSave(data.projectDate);
            }
        });
    }

    if (!projectDate) {
        return ("....");
    }

    projectDate.dateFormated = "";
    if (projectDate && "date" in projectDate && projectDate.date && "date" in projectDate.date) {
        projectDate.dateFormated = projectDate.date.date.substring(0, 10)
    }

    return (
        <>
            {projectDate && "name" in projectDate && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="mb-3">
                            <label htmlFor="form_edit_name">Název</label>
                            <input defaultValue={projectDate.name} type="text" name="name" className="form-control"
                                   id="form_edit_name"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_date">Datum</label>
                            <input defaultValue={projectDate.dateFormated} type="date"
                                   name="date"
                                   className="form-control"
                                   id="form_edit_date"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_color">Barva</label>
                            <input defaultValue={projectDate.color} type="text" name="color" className="form-control"
                                   id="form_edit_color"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_priority">Priorita</label>
                            <input defaultValue={projectDate.priority} type="text" name="priority"
                                   className="form-control"
                                   id="form_edit_priority"/>
                        </div>
                        <div className="mb-3">
                            <div className="form-check form-switch"><input className="form-check-input"
                                                                           name="done"
                                                                           type="checkbox"
                                                                           id="form_edit_done"
                                                                           defaultChecked={projectDate.done}
                            />
                                <label className="form-check-label" htmlFor="form_edit_done">Splněno</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_task_id">Úkol</label>
                            <TasksSelectList projectId={projectId} selected={projectDate.taskId} onChange={setSelectedTaskId}/>
                            <input type="hidden" name="task_id" value={selectedTaskId}/>
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

export default ProjectDateForm;