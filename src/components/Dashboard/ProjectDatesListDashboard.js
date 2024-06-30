import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import { NavLink } from "react-router-dom";
import ProjectDateFormModal from "../ProjectDates/ProjectDateFormModal";
import ProjectDatesListItem from "../ProjectDates/ProjectDatesListItem";

const ProjectDatesListDashboard = ({ }) => {
    const { API } = useRootContext()
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [projectDates, setProjectDates] = useState([]);
    const [projects, setProjects] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    let projectDatesWithDeadLine = [];
    let projectDatesWithoutDeadLine = [];
    let projectDatesSorted = [];

    useEffect(() => {
        if (!reload) return;

        API.getData("/projectDate/list", (projectDates) => {
            setProjectDates(projectDates);
        });
        API.getData("/client/list", (clients) => {
            setClients(clients);
        });
        API.getData("/project/list", (projects) => {
            setProjects(projects);
        });
        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);
        });

        setReload(false);
    }, [reload]);

    if (projectDates && projectDates.length > 1) {
        projectDatesWithDeadLine = projectDates.filter(projectDate => "date" in projectDate && projectDate.date && !projectDate.done);

        projectDatesWithDeadLine = projectDatesWithDeadLine.sort((a, b) => new Date(a.date.date) - new Date(b.date.date));
    }

    projectDatesSorted = projectDatesWithDeadLine.concat(projectDatesWithoutDeadLine);

    return (
        <div className="card notification-card border-0 shadow">
            <div className="card-header d-flex align-items-center"><h2
                className="fs-5 fw-bold mb-0">Data projektů</h2>
                <div className="ms-auto">
                    <NavLink to="/projectDates" className="fw-normal d-inline-flex align-items-center" href="#">
                        <svg className="icon icon-xxs me-2" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"></path>
                        </svg>
                        Zobrazit všechny</NavLink></div>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush list-group-timeline">
                    {projectDatesSorted && projectDatesSorted.length > 0 && projectDatesSorted.map((projectDate, projectDate_index) => (
                        <React.Fragment key={projectDate_index}>
                            <ProjectDatesListItem
                                projectDate={projectDate}
                                projects={projects}
                                endCustomers={endCustomers}
                                clients={clients}
                                onUpdate={() => setReload(true)} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default ProjectDatesListDashboard;