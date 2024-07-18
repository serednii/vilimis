import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import TaskNew from "../components/Tasks/TaskNew";
import TaskEdit from "../components/Tasks/TaskEdit";
import TasksKanban from "../components/Tasks/TasksKanban";
import TasksWeekKanban from "../components/Tasks/TasksWeekKanban";
import TasksList from "../components/Tasks/TasksList";

const Tasks = ({ }) => {
    useEffect(() => {
        document.title = "Úkoly";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<TaskEdit />} />
            <Route path="new" element={<TaskNew />} />
            <Route path="list" element={<TasksKanban />} />
            <Route path="week" element={<TasksWeekKanban />} />
            <Route path="*" element={<TasksList />} />
        </Routes>
    );
}

export default Tasks;