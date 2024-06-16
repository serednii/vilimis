import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ProjectsSelectList from "../Projects/ProjectsSelectList";

const taskBlank = {
    name: "",
    hourBudget: "",
    projectId: null
}

const TaskForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [task, setTask] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

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

    return (
        <>
            {task && "name" in task && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_project_id">Projekt</label>
                        <ProjectsSelectList selected={task.projectId} onChange={setSelectedProjectId}/>
                        <input type="hidden" name="project_id" value={selectedProjectId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={task.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_hour_budget">Hodinový rozpočet</label>
                        <input defaultValue={task.hourBudget} type="number" name="hour_budget" className="form-control"
                               id="form_edit_hour_budget"></input>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default TaskForm;