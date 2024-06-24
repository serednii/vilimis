import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { useRootContext } from "../../contexts/RootContext";

const title = 'Projekty/';

const ProjectNew = ({ }) => {
    const navigate = useNavigate();
    const { setUrlToTitle } = useRootContext()

    useEffect(() => {
        setUrlToTitle({
            setUrlToTitle: {
                ['projects']: title
            }
        })
    }, [])

    function handleSave(project) {
        if (project && "id" in project) {
            const id = project.id;
            navigate("/projects/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový projekt</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <ProjectForm handleSave={handleSave} />
                </div>
            </div>
        </>
    );
};

export default ProjectNew;