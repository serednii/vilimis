import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import {Plus, Trash} from "@phosphor-icons/react";
import TaskFormModal from "../Tasks/TaskFormModal";
import ProjectFormModal from "./ProjectFormModal";
import TaskUtils from "../../utils/TaskUtils";
import BudgetCalculator from "../../utils/BudgetCalculator";
import ProjectUtils from "../../utils/ProjectUtils";

const title = "Projekty";

const ProjectsList = ({clientId}) => {
    const {API, setUrlToTitle} = useRootContext();
    const [projects, setProjects] = useState([]);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    const [reload, setReload] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState(0);

    useEffect(() => {
        setUrlToTitle({
            setUrlToTitle: {
                ["projects"]: title,
            },
        });
    }, []);

    useEffect(() => {
        if (!reload) return;

        setProjectsLoading(true);

        API.getData("/projectStatus/list?order=priority%20DESC", (projectStatuses) => {
            setProjectStatuses(projectStatuses);

            let url = "/project/list?order=name";
            if (clientId) {
                url += "&filter[client_id]=" + clientId;
            }
            API.getData(url, (projects) => {
                setProjects(projects);
            });
        });

        API.getData("/client/list", (clients) => {
            setClients(clients);
        });

        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);
        });

        setProjectsLoading(false);
        setReload(false);
    }, [reload]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [modalProjectId, setModalProjectId] = React.useState(0);

    function closeModal() {
        setIsOpen(false);
    }

    function closeSettingsModal() {
        setIsSettingsOpen(false);
    }

    function handleDelete(id, noreload) {
        API.getData("/project/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    if (projectsLoading) {
        return ("Načítání...");
    }

    let projectUtil = null;
    let budgetUtil = null;


    const handleBulkAction = () => {
        switch (bulkAction) {
            case "delete":
                selectedIds.forEach(id => {
                    handleDelete(id, true)
                });
                setReload(true);
                break;
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0">
                    <h1 className="h4">{title}</h1>
                </div>
            </div>

            <div className="my-3">
                <button onClick={() => {setIsOpen(true);setModalProjectId(null);}}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={16} className="me-2"/>
                    Nový projekt
                </button>
            </div>

            {projects?.length > 0 ? (
                <>
                    <div className="d-flex mb-3"><select className="form-select fmxw-200"
                                                         disabled={selectedIds.length === 0}
                                                         defaultValue=""
                                                         onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Hromadná akce</option>
                        <option value="delete">Smazat</option>
                    </select>
                        <button disabled={selectedIds.length === 0}
                                onClick={handleBulkAction}
                                className="btn btn-sm px-3 btn-secondary ms-3">Provést
                        </button>
                    </div>
                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-items-center">
                                    <thead>
                                    <tr>
                                        <td style={{maxWidth: "15px", width: "15px", minWidth: "15px"}}
                                            className="p-0 ps-2 border-bottom">
                                            <div className="form-check dashboard-check">
                                                <input className="form-check-input" type="checkbox" id="item_all"
                                                       onClick={(e) => {
                                                           if (e.target.checked) {
                                                               setSelectedIds((prev) => [...projects.map((task) => task.id)]);
                                                           } else {
                                                               setSelectedIds((prev) => []);
                                                           }
                                                       }}
                                                />
                                                <label className="form-check-label" htmlFor="item_all"/>
                                            </div>
                                        </td>
                                        <th className="border-bottom">Název</th>
                                        {!clientId && (
                                            <th className="border-bottom">Klient</th>
                                        )}
                                        <th className="border-bottom">Rozpočet</th>
                                        <th className="border-bottom">Stav</th>
                                        <th className="border-bottom">Proces</th>
                                        <th className="border-bottom">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {projects?.map((project, project_key) => (
                                        <tr key={project_key+" "+project.id}>
                                            {(projectUtil = new ProjectUtils(project, projectStatuses, clients, endCustomers)) && ""}
                                            {(budgetUtil = new BudgetCalculator(project.spendingTime, null, project)) && ""}

                                            <td className="p-0 ps-2">
                                                <div className="form-check dashboard-check">
                                                    <input className="form-check-input" type="checkbox"
                                                           id={"item_" + project.id}
                                                           checked={selectedIds?.includes(project.id)}
                                                           onChange={(e) => {
                                                               if (e.target.checked) {
                                                                   setSelectedIds((prev) => [...prev, project.id]);
                                                               } else {
                                                                   setSelectedIds((prev) => prev.filter((id) => id != project.id));
                                                               }
                                                           }}
                                                           />
                                                    <label className="form-check-label" htmlFor={"item_" + project.id}/>
                                                </div>
                                            </td>
                                            <td className="fw-bold  text-wrap">
                                                <a onClick={() => {
                                                    setModalProjectId(project.id);
                                                    setIsOpen(true)
                                                }}
                                                   className="text-primary fw-bold">
                                                    {project.name}
                                                </a>
                                            </td>
                                            {!clientId && (
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {project.isImg ? (
                                                            <div className="me-2">
                                                            <img src={projectUtil.imgUrl}
                                                                     style={{maxWidth: "100px", maxHeight: "50px"}}/>

                                                            </div>
                                                        ) : (
                                                            <div className="d-block">
                                                                <span
                                                                    className="fw-bold">{projectUtil.client?.name}</span>
                                                                <div
                                                                    className="small text-gray">{projectUtil.endCustomer?.name}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                            <td>
                                                {budgetUtil.projectBudgetNicely("Kč")}
                                            </td>
                                            <td>
                                            <span
                                                className="fw-normal text-success">{projectUtil.projectStatus?.name}</span>
                                            </td>
                                            <td>

                                                <div className="progress-wrapper">
                                                    <div className="progress-info">
                                                        <div
                                                            className="h6 mb-0">{project.spendingTime ? (budgetUtil.calculareSpendingHoursNicely()) : "00:00"}</div>
                                                        <div className="small fw-bold text-gray-500">
                                                            <span>{project.hourBudget} hod.</span></div>
                                                    </div>
                                                    <div className="progress mb-0">
                                                        <div className="progress-bar bg-success" role="progressbar"
                                                             aria-valuenow={budgetUtil.calculareSpendingPercent()}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: budgetUtil.calculareSpendingPercent() + "%"}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(project.id)}
                                                    className="btn btn-sm btn-link" type="button">
                                                    <Trash/>
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
            ) : (
                <p>Zatím žádný projekt</p>
            )}

            {modalIsOpen && (
                <ProjectFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    id={modalProjectId}
                    clientId={clientId}
                    callback={() => setReload(true)}/>
            )}
        </>
    );
};

export default ProjectsList;
