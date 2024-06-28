import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import TaskStatusesSelectList from "../TaskStatuses/TaskStatusesSelectList";

const ReportsSettingsForm = ({handleSave, settings, setSettings}) => {
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
                <div className="mb-3">

                <input type="date" className="form-control"
                       name="date"
                       onChange={(e) => setNewSettings({...newSettings, [e.target.name]: new Date(e.target.value)})}
                       defaultValue={settings.date?.toISOString().substring(0, 10)}/>

                </div>

                <button type="submit" className="btn btn-primary">
                    Uložit
                </button>
            </form>
        </>
    );
};

export default ReportsSettingsForm;