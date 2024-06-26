import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import TaskStatusesSelectList from "../TaskStatuses/TaskStatusesSelectList";

const TasksKanbanSettingsForm = ({handleSave, settings, setSettings, taskStatuses}) => {
    const [newSettings, setNewSettings] = useState(settings);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        setSettings(newSettings)

        if (handleSave) {
            handleSave(newSettings);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <h3 className="mb-3">Zobrazení sloupců</h3>

                        {taskStatuses?.map((taskStatus)=> (
                            <div className="form-check form-switch mb-3" key={taskStatus.id}>
                                <input className="form-check-input"
                                       defaultChecked={settings.showTaskStatuses?.includes(taskStatus.id)}
                                       name="showClosed"
                                       type="checkbox"
                                       value={taskStatus.id}
                                       onChange={(e) => {
                                           const value = parseInt(e.target.value);
                                           const showTaskStatuses = newSettings.showTaskStatuses;

                                           if (showTaskStatuses?.includes(value)) {
                                               showTaskStatuses.splice(showTaskStatuses.indexOf(value), 1);
                                           }

                                           if (e.target.checked) {
                                               showTaskStatuses.push(value)
                                           }

                                           return setNewSettings({
                                               ...newSettings,
                                               showTaskStatuses
                                           });
                                       }}
                                       id={"form_edit_status"+taskStatus.id}/>
                                <label className="form-check-label" htmlFor={"form_edit_status"+taskStatus.id}>{taskStatus.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="col-12 col-md-4">
                        <h3 className="mb-3">Zobrazení úkolů</h3>

                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input"
                                   defaultChecked={settings.showClosed}
                                   name="showClosed"
                                   type="checkbox"
                                   onChange={(e) => setNewSettings({...newSettings, [e.target.name]: e.target.checked})}
                                   id="form_edit_closed"/>
                            <label className="form-check-label" htmlFor="form_edit_closed">
                                Zobrazit uzavřené
                            </label>
                        </div>

                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input"
                                   defaultChecked={settings.showArchived}
                                   name="showArchived"
                                   type="checkbox"
                                   onChange={(e) => setNewSettings({...newSettings, [e.target.name]: e.target.checked})}
                                   id="form_edit_archived"/>
                            <label className="form-check-label" htmlFor="form_edit_archived">
                                Zobrazit archivované
                            </label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Uložit
                </button>
            </form>
        </>
    );
};

export default TasksKanbanSettingsForm;