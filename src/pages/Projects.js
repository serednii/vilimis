import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import ProjectNew from "../components/Projects/ProjectNew";
import ProjectEdit from "../components/Projects/ProjectEdit";
import ProjectsKanban from "../components/Projects/ProjectsKanban";

const Projects = ({}) => {
    useEffect(() => {
        document.title = "Projekty";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<ProjectEdit/>}/>
            <Route path="new" element={<ProjectNew/>}/>
            <Route path="*" element={<ProjectsKanban/>}/>
        </Routes>
    );
}

export default Projects;