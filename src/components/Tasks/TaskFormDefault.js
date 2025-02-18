import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import TaskStatusesSelectList from "../TaskStatuses/TaskStatusesSelectList";
import JoditEditor from 'jodit-react';
import {CONFIG} from "../../config";
import TasksSelectList from "./TasksSelectList";

const taskBlank = {
    name: "",
    hourBudget: "",
    projectId: null
}

const TaskFormDefault = ({id, handleSave, projectId}) => {
    const {API} = useRootContext()
    const [task, setTask] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedBoundToTaskId, setSelectedBoundToTaskId] = useState(null);
    const [selectedTaskStatusId, setSelectedTaskStatusId] = useState(null);

    const editor = useRef(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            API.getData("/task/single/" + id, (task) => {
                setContent(task.description);
                setTask(task);
            });
        } else {
            setContent("");
            if (projectId) {
                taskBlank.projectId = projectId;
            }
            setTask(taskBlank)
        }
    }, [id, projectId]);

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
                    <input type="hidden" name="planned_priority" value={task.plannedPriority}/>
                    <input type="hidden" name="planned_date" value={task.plannedDate?.date}/>
                    <input type="hidden" name="spending_time" value={task.spendingTime}/>
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={task.name} type="text" name="name" className="form-control form-control-lg"
                                       id="form_edit_name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_description">Zadání</label>

                                <input type="hidden" name="description" value={content}/>

                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    config={CONFIG.joedit}
                                    onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                    onChange={newContent => {}}
                                />
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
                            <div className="mb-3">
                                <label htmlFor="form_edit_bound_to_task_id">Vázáno na úkol</label>
                                <TasksSelectList projectId={task.projectId} notId={task.id} selected={task.boundToTaskId} onChange={setSelectedBoundToTaskId}/>
                                <input type="hidden" name="bound_to_task_id" value={selectedBoundToTaskId}/>
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