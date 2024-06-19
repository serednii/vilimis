import React from "react";
import ProjectFormDefault from "./ProjectFormDefault";
import ProjectDatesList from "../ProjectDates/ProjectDatesList";

const ProjectForm = ({id, handleSave}) => {
    return (
        <>
            {id && id > 0 ? (
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h5>Nastavení</h5>
                        <ProjectFormDefault id={id} handleSave={handleSave}/>
                    </div>
                    <div className="col-12 col-md-6">
                        <h5>Data projektu</h5>
                        <ProjectDatesList projectId={id}/>
                    </div>
                </div>
            ): (
                <ProjectFormDefault id={id} handleSave={handleSave}/>
            )}
        </>
    );
};

export default ProjectForm;