import React from "react";
import {useNavigate} from "react-router-dom";
import TaskForm from "./TaskForm";

const TaskNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(task) {
        if (task && "id" in task) {
            const id = task.id;
            navigate("/tasks/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový úkol</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <TaskForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default TaskNew;