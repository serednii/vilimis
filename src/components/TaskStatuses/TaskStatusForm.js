import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

const taskStatusBlank = {
    name: "",
    priority: -1
}

const TaskStatusForm = ({id, handleSave, projectId}) => {
    const {API} = useRootContext()
    const [taskStatus, setTaskStatus] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/taskStatus/single/" + id, (taskStatus) => {
                setTaskStatus(taskStatus);
            });
        } else {
            setTaskStatus(taskStatusBlank)
        }
    }, [id, projectId]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/taskStatus/save", formData, (data) => {
            setTaskStatus(data.taskStatus);

            if (handleSave) {
                handleSave(data.taskStatus);
            }
        });
    }

    if (!taskStatus) {
        return (<>Načítaní..</>)
    }

    return (
        <>
            {taskStatus && "name" in taskStatus && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="priority" value={taskStatus.priority}/>
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={taskStatus.name} type="text" name="name" className="form-control form-control-lg"
                                       id="form_edit_name"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="form_edit_color">Barva</label>
                                <input defaultValue={taskStatus.color} type="text" name="color"
                                       className="form-control"
                                       id="form_edit_color"></input>
                            </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default TaskStatusForm;