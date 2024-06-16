import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import TasksList from "../components/Tasks/TasksList";
import TaskNew from "../components/Tasks/TaskNew";
import TaskEdit from "../components/Tasks/TaskEdit";

const Tasks = ({}) => {
    useEffect(() => {
        document.title = "Úkoly";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<TaskEdit/>}/>
            <Route path="new" element={<TaskNew/>}/>
            <Route path="*" element={<TasksList/>}/>
        </Routes>
    );
}

export default Tasks;