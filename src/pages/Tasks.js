import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import TaskNew from "../components/Tasks/TaskNew";
import TaskEdit from "../components/Tasks/TaskEdit";
import TasksKanban from "../components/Tasks/TasksKanban";

const Tasks = ({}) => {
    useEffect(() => {
        document.title = "Úkoly";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<TaskEdit/>}/>
            <Route path="new" element={<TaskNew/>}/>
            <Route path="*" element={<TasksKanban/>}/>
        </Routes>
    );
}

export default Tasks;