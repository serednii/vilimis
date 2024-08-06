import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import ProjectsKanbanColumn from "./ProjectsKanbanColumn";
import update from 'immutability-helper'
import ProjectFormModal from "./ProjectFormModal";
import {CONFIG} from "../../config";

const ProjectsYear = ({}) => {
    const {API, locale} = useRootContext()
    const [projects, setProjects] = useState([]);
    const [projectsNonPlanned, setProjectsNonPlanned] = useState([]);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [clients, setClients] = useState([]);
    const [reload, setReload] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [endCustomers, setEndCustomers] = useState([]);



    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalProjectId, setModalProjectId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }



    const year = new Date().getFullYear();
    const actualMonth = new Date().getMonth();
    const actualDate = new Date();
    let tmpDate = new Date();
    let countMonths =  [...Array(12).keys()];
    const months = [];
    const daysInMonths = [];
    countMonths.forEach(monthIndex => {
        months.push(new Date(structuredClone(actualDate).setMonth(actualMonth+monthIndex)).toISOString().substring(0, 7));
        daysInMonths.push(new Date(parseInt(months[monthIndex].substring(0, 4)), parseInt(months[monthIndex].substring(5, 7)), 0).getDate());
    });

    useEffect(() => {
        if (!reload) return;

        API.getData("/projectStatus/list?order=priority%20ASC", (projectStatuses) => {
            setProjectStatuses(projectStatuses);

            if (projectStatuses && projectStatuses.length > 0) {
                API.getData("/project/list?order=planned_from", (projects) => {
                    let projectSorted = [];
                    let projectSortedNonPlanned = [];

                    projects.forEach(project=>{
                        if (project.plannedFrom?.date?.substring(0,7)<=months[11]
                            && project.plannedTo?.date?.substring(0,7)>=months[0]) {

                            if (project.plannedFrom?.date?.substring(0,7)<months[0]) {
                                project.plannedFrom.date = months[0]+"-01 00:00:00";
                            }
                            if (project.plannedTo?.date?.substring(0,7)>months[11]) {
                                project.plannedTo.date = months[11]+"-"+daysInMonths[11]+" 00:00:00";
                            }

                            projectSorted.push(project);
                        } else if (!project.plannedFrom?.date || project.plannedTo?.date) {
                            projectSortedNonPlanned.push(project);
                        }
                    })

                    console.log(projectSorted)
                    setProjects(projectSorted);
                    setProjectsNonPlanned(projectSortedNonPlanned);
                });
            }
        });

        API.getData("/client/list", (clients) => {
            setClients(clients);
        });
        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);
        });

        setReload(false);
    }, [reload]);

    if (!projectStatuses || projectStatuses.length === 0) {
        return ("...");
    }

    const width = 150;
    let tmpWidth = width;
    const oneDay = 24 * 60 * 60 * 1000;
    let isImg = false;

    return (
        <>

            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Projekty - roční plán</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nový projekt</button>
            </div>


            {projects?.length > 0 ? (
            <div className="table-responsive">
                <table className="position-relative table table-centered  mb-0 rounded table-bordered">
                    <thead>
                    <tr className="text-center">
                    {countMonths.map(monthIndex=>(
                        <th key={monthIndex}>
                            {(tmpDate = new Date(structuredClone(actualDate).setMonth(actualMonth + monthIndex))) && ""}

                            {locale._months_fullname[tmpDate.getMonth()]} {tmpDate.getFullYear()}
                        </th>
                    ))}
                    </tr>
                    </thead>
                    <tbody className="position-relative">

                    {projects?.map(project=>(
                        <tr className="position-relative" key={project.id}>
                            {countMonths.map((monthIndex, monthKey)=>(
                                <>
                                    {(tmpWidth = width/31*daysInMonths[monthKey]) && ""}
                                <td style={{
                                    width: tmpWidth+"px",
                                    minWidth: tmpWidth+"px",
                                    maxWidth: tmpWidth+"px",
                                    height: "60px",
                                    position: "relative"
                                }} key={project.id+"-"+monthIndex}>
                                    &nbsp;
                                    {months[monthKey] === project.plannedFrom.date.substring(0, 7) && (
                                        <div className="card shadow timetrack-table__item"
                                        style={{
                                            zIndex: 20,
                                            overflow: "hidden",
                                            position: "absolute",
                                            left: Math.round(width/100*(100/31*(Math.abs(new Date(project.plannedFrom.date.substring(0, 10)) - new Date(months[monthKey]+"-01"))/oneDay)))+"px",
                                            minWidth: Math.round(width/100*(100/31*(Math.abs(new Date(project.plannedTo.date.substring(0, 10)) - new Date(project.plannedFrom.date.substring(0, 10)))/oneDay+1)))+"px",
                                            width: "auto",
                                            top: "0px",
                                            height: "100%"
                                        }}
                                             onClick={() => {
                                                 setModalProjectId(project.id);
                                                 setIsOpen(true)
                                             }}
                                        >
                                            <div className="timetrack-table__item__content  overflow-auto">
                                                <div className="d-flex align-content-center align-items-center">

                                                    <div className="pe-3">
                                            {isImg = false}
                                            <React.Fragment>

                                                {"endCustomerId" in project && project.endCustomerId && endCustomers.filter(endCustomer => endCustomer.id === project.endCustomerId).map((endCustomer, endCustomer_index) => (
                                                    endCustomer.logo && (
                                                        <React.Fragment key={endCustomer_index}>
                                                            <img className="object-fit-contain"
                                                                 src={CONFIG.uploadDir + endCustomer.logo} height={42}/>
                                                            {isImg = true}
                                                        </React.Fragment>
                                                    )
                                                ))}
                                                {!isImg && "clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                                    <React.Fragment key={client_index}>
                                                        <img className="object-fit-contain"
                                                             src={CONFIG.uploadDir + client.logo} height={42}/>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment></div>
                                                    <div>
                                                    {project.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                </>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <p>Zatím žádný projekt</p>
            )}

            {projectsNonPlanned?.length > 0 && (
                <>
                    <h2 className="h5 mt-4 mb-4">Nenaplánované projekty:</h2>

                    {projectsNonPlanned?.map(project=>(
                        <>
                            <div className="card shadow timetrack-table__item mb-3"
                                 onClick={() => {
                                     setModalProjectId(project.id);
                                     setIsOpen(true)
                                 }}
                            >
                                <div className="timetrack-table__item__content  overflow-auto">
                                    <div className="d-flex align-content-center align-items-center" style={{
                                        position: "sticky",
                                        left: 0,
                                        minWidth: "100%"
                                    }}>

                                        <div className="pe-3">
                                            {isImg = false}
                                            <React.Fragment>

                                                {"endCustomerId" in project && project.endCustomerId && endCustomers.filter(endCustomer => endCustomer.id === project.endCustomerId).map((endCustomer, endCustomer_index) => (
                                                    endCustomer.logo && (
                                                        <React.Fragment key={endCustomer_index}>
                                                            <img
                                                                src={CONFIG.uploadDir + endCustomer.logo} height={42}/>
                                                            {isImg = true}
                                                        </React.Fragment>
                                                    )
                                                ))}
                                                {!isImg && "clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                                    <React.Fragment key={client_index}>
                                                        <img
                                                            src={CONFIG.uploadDir + client.logo} height={42}/>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment></div>
                                        <div>
                                            {project.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </>
            )}

                {modalIsOpen && (
                    <ProjectFormModal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        id={modalProjectId}
                        callback={()=>setReload(true)}/>
                )}
        </>
    );
};

export default ProjectsYear;