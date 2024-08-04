import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

const projectStatusBlank = {
    name: "",
    priority: -1
}

const ProjectStatusForm = ({id, handleSave, projectId}) => {
    const {API} = useRootContext()
    const [projectStatus, setProjectStatus] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/projectStatus/single/" + id, (projectStatus) => {
                setProjectStatus(projectStatus);
            });
        } else {
            setProjectStatus(projectStatusBlank)
        }
    }, [id, projectId]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/projectStatus/save", formData, (data) => {
            setProjectStatus(data.projectStatus);

            if (handleSave) {
                handleSave(data.projectStatus);
            }
        });
    }

    if (!projectStatus) {
        return (<>Načítaní..</>)
    }

    return (
        <>
            {projectStatus && "name" in projectStatus && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="priority" value={projectStatus.priority}/>
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={projectStatus.name} type="text" name="name" className="form-control form-control-lg"
                                       id="form_edit_name"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="form_edit_color">Barva</label>
                                <input defaultValue={projectStatus.color} type="text" name="color"
                                       className="form-control"
                                       id="form_edit_color"></input>
                            </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default ProjectStatusForm;