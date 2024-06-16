import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ClientsSelectList from "../Clients/ClientsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";
import ProjectStatusesSelectList from "../ProjectStatus/ProjectsStatusSelectList";

const projectBlank = {
    name: "",
    budget: "",
    hourBudget: "",
    hourRate: "",
    projectStatusId: null,
    endConsumerId: null,
    clientId: null
}

const ProjectForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [project, setProject] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);
    const [selectedProjectStatusId, setSelectedProjectStatusId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/project/single/" + id, (data) => {
                setProject(data);
            });
        } else {
            setProject(projectBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/project/save", formData, (data) => {
            setProject(data.project);

            if (handleSave) {
                handleSave(data.project);
            }
        });
    }

    return (
        <>
            {project && "name" in project && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Klient</label>
                        <ClientsSelectList selected={project.clientId} onChange={setSelectedClientId}/>
                        <input type="hidden" name="client_id" value={selectedClientId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Koncový uživatel</label>
                        <EndCustomersSelectList selected={project.endCustomerId} onChange={setSelectedEndCustomerId}/>
                        <input type="hidden" name="end_customer_id" value={selectedEndCustomerId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Koncový uživatel</label>
                        <ProjectStatusesSelectList selected={project.projectStatusId} onChange={setSelectedProjectStatusId}/>
                        <input type="hidden" name="project_status_id" value={selectedProjectStatusId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={project.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_budget">Rozpočet</label>
                        <input defaultValue={project.budget} type="number" name="budget" className="form-control"
                               id="form_edit_budget"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_hour_rate">Hodinová sazba</label>
                        <input defaultValue={project.hourRate} type="number" name="hour_rate" className="form-control"
                               id="form_edit_hour_rate"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_hour_budget">Hodinový rozpočet</label>
                        <input defaultValue={project.hourBudget} type="number" name="hour_budget"
                               className="form-control" id="form_edit_hour_budget"/>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default ProjectForm;