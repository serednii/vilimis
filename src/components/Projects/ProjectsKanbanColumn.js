import React, {useCallback, useState} from "react";
import ProjectsKanbanItem from "./ProjectsKanbanItem";
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'
import ProjectsKanbanItemBlank from "./ProjectsKanbanItemBlank";
    const ProjectsKanbanColumn = ({projectStatus, projects, clients, setReload, endCustomers, moveCard}) => {

    return (
        <>
            <div className="col-12 col-lg-6 col-xl-4 col-xxl-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fs-6 fw-bold mb-0">{projectStatus.name}</h5>
                </div>


                <div className="list-group kanban-list">
                    {projects && projects.length > 0 && projects.map((project, project_index) => (
                        <ProjectsKanbanItem
                            key={project.id+"-"+project_index}
                            id={project.id}
                            projectStatusId={projectStatus.id}
                            index={project_index}
                            project={project}
                            endCustomers={endCustomers}
                            clients={clients}
                            moveCard={moveCard}
                            onUpdate={() => setReload(true)}/>
                    ))}

                    {!projects || projects.length == 0 && (
                        <ProjectsKanbanItemBlank moveCard={moveCard} id="0" index="-1" projectStatusId={projectStatus.id}/>
                    )}


                </div>
            </div>
        </>
    );
};

export default ProjectsKanbanColumn;