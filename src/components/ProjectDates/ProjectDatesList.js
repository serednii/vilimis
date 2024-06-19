import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import ProjectDateFormModal from "./ProjectDateFormModal";

const ProjectDatesList = ({projectId}) => {
    const {API} = useRootContext()
    const [projectDates, setProjectDates] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalProjectDateId, setModalProjectDateId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        loadProjectDates();
    }, [projectId]);

    function handleDelete(id) {
        API.getData("/projectDate/delete/"+id, ()=>{
            loadProjectDates();
        });
    }

    function handleUpdate()
    {
        loadProjectDates();
    }
    function loadProjectDates() {
        let url = "/projectDate/list";

        url += "?order=priority DESC"
        if (projectId) {
            url += "&filter[project_id]="+encodeURIComponent(projectId);
        }

        API.getData(url, (projectDates) => {
            setProjectDates(projectDates);
        });
    }

    return (
        <>
            <div className="my-3">
                <button onClick={() => {
                    setModalProjectDateId(null);
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nové datum projektu</button>
            </div>

            <div className="list-group list-group-flush list-group-timeline">
                {projectDates && projectDates.length > 0 && projectDates.map((projectDate, projectDate_key) => (
                    <div role="presentation" onClick={() => {
                        setModalProjectDateId(projectDate.id);
                        setIsOpen(true)
                    }}   className={"cursor-pointer list-group-item border-0 c "+(!!projectDate.done && "list-group-item--done list-group-item--stripe")} key={projectDate_key}>
                        <div className="fw-bold">
                            {projectDate.name}
                        </div>
                        <div>
                            {projectDate && "date" in projectDate && projectDate.date && "date" in projectDate.date && (
                                <small>
                                {(new Date(projectDate.date.date)).toLocaleDateString()}
                                </small>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalIsOpen && (
                <ProjectDateFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={handleUpdate}
                    projectId={projectId}
                    id={modalProjectDateId}/>
            )}
        </>
    );
};

export default ProjectDatesList;