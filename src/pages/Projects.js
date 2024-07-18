import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import ProjectNew from "../components/Projects/ProjectNew";
import ProjectEdit from "../components/Projects/ProjectEdit";
import ProjectsKanban from "../components/Projects/ProjectsKanban";
import ProjectsYear from "../components/Projects/ProjectsYear";
import ProjectsList from "../components/Projects/ProjectsList";

const Projects = ({}) => {
    useEffect(() => {
        document.title = "Projekty";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<ProjectEdit/>}/>
            <Route path="new" element={<ProjectNew/>}/>
            <Route path="list" element={<ProjectsKanban/>}/>
            <Route path="year" element={<ProjectsYear/>}/>
            <Route path="*" element={<ProjectsList/>}/>
        </Routes>
    );
}

export default Projects;