import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import ProjectsList from "../components/Projects/ProjectsList";
import ProjectNew from "../components/Projects/ProjectNew";
import ProjectEdit from "../components/Projects/ProjectEdit";

const Projects = ({}) => {
    useEffect(() => {
        document.title = "Projekty";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<ProjectEdit/>}/>
            <Route path="new" element={<ProjectNew/>}/>
            <Route path="*" element={<ProjectsList/>}/>
        </Routes>
    );
}

export default Projects;