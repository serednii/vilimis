import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { NavLink } from "react-router-dom";

const title = "Projekty";

const ProjectsList = ({ }) => {
    const { API, setUrlToTitle } = useRootContext();
    const [projects, setEndConsumers] = useState([]);

    useEffect(() => {
        setUrlToTitle({
            setUrlToTitle: {
                ["projects"]: title,
            },
        });
    }, []);

    useEffect(() => {
        API.getData("/project/list", (projects) => {
            setEndConsumers(projects);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/project/delete/" + id, () => {
            API.getData("/project/list", (projects) => {
                setEndConsumers(projects);
            });
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0">
                    <h1 className="h4">{title}</h1>
                </div>
            </div>

            <div className="my-3">
                <NavLink to="/projects/new" className="btn btn-primary" type="button">
                    Nový projekt
                </NavLink>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0 rounded">
                            <thead className="thead-light">
                                <tr>
                                    <th className="border-0 rounded-start">#</th>
                                    <th className="border-0">Název</th>
                                    <th className="border-0">Rozpočet</th>
                                    <th className="border-0">Hodinový rozpočet</th>
                                    <th className="border-0">Hodinová sazba</th>
                                    <th className="border-0 rounded-end">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects?.length > 0 &&
                                    projects.map((project, project_key) => (
                                        <tr key={project_key}>
                                            <td>
                                                <NavLink
                                                    to={"/projects/edit/" + project.id}
                                                    className="text-primary fw-bold"
                                                >
                                                    {project.id}
                                                </NavLink>
                                            </td>
                                            <td className="fw-bold ">{project.name}</td>
                                            <td> {project.budget}</td>
                                            <td> {project.hourBudget}</td>
                                            <td> {project.hourRate}</td>
                                            <td>
                                                <NavLink
                                                    to={"/projects/edit/" + project.id}
                                                    className="btn btn-sm btn-primary"
                                                    type="button"
                                                >
                                                    Upravit
                                                </NavLink>
                                                <button
                                                    onClick={() =>
                                                        window.confirm("Opravdu smazat?") &&
                                                        handleDelete(project.id)
                                                    }
                                                    className="btn btn-sm btn-danger"
                                                    type="button"
                                                >
                                                    Smazat
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectsList;
