import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import ProjectsKanbanColumn from "./ProjectsKanbanColumn";
import update from 'immutability-helper'
import ProjectFormModal from "./ProjectFormModal";

const ProjectsKanban = ({}) => {
    const {API} = useRootContext()
    const [projects, setProjects] = useState([]);
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

    useEffect(() => {
        if (!reload) return;

        API.getData("/projectStatus/list?order=priority%20ASC", (projectStatuses) => {
            setProjectStatuses(projectStatuses);

            if (projectStatuses && projectStatuses.length > 0) {
                API.getData("/project/list?order=priority", (projects) => {
                    let projectSorted = {};

                    if (projects && projects.length > 0) {
                        projectStatuses.forEach(projectStatus => {
                            projectSorted[projectStatus.id] = projects.filter(project => project.projectStatusId == projectStatus.id)
                        })
                    }

                    setProjects(projectSorted)
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


    const moveCard = (dragIndex, hoverIndex, projectStatusId, hoverProjectStatusId) => {
        if (!projectStatusId) {
            return;
        }

        if (projectStatusId == hoverProjectStatusId) {
            setProjects((prevCards) => {
                    prevCards[projectStatusId] = update(prevCards[projectStatusId], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards[projectStatusId][dragIndex]],
                        ]
                    })

                    let formData = new FormData;
                    prevCards[projectStatusId].forEach((card, index)=>{
                        formData.append("projects[id][]", card.id);
                        formData.append("projects[priority][]", index);
                        formData.append("projects[projectStatusId][]", projectStatusId);
                    });
                    API.postData("/projectPriority/save", formData);

                    return prevCards;
                }
            )
        } else if (projectStatusId > 0) {
            setProjects((prevCards) => {
                let newCard = prevCards[projectStatusId][dragIndex];
                newCard.projectStatusId = hoverProjectStatusId;

                prevCards[projectStatusId] = update(prevCards[projectStatusId], {
                    $splice: [
                        [dragIndex, 1]
                    ]
                });

                prevCards[hoverProjectStatusId] = update(prevCards[hoverProjectStatusId], {
                    $splice: [
                        [hoverIndex, 0, newCard],
                    ]
                });

                let formData = new FormData;
                prevCards[projectStatusId].forEach((card, index)=>{
                    formData.append("projects[id][]", card.id);
                    formData.append("projects[priority][]", index);
                    formData.append("projects[projectStatusId][]", projectStatusId);
                });
                prevCards[hoverProjectStatusId].forEach((card, index)=>{
                    formData.append("projects[id][]", card.id);
                    formData.append("projects[priority][]", index);
                    formData.append("projects[projectStatusId][]", hoverProjectStatusId);
                });

                API.postData("/projectPriority/save", formData);

                return prevCards;
            });
        }
        setReload((prev)=>prev+1);

    };

    if (!projectStatuses || projectStatuses.length === 0) {
        return ("...");
    }

    return (
        <>

            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Projekty</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nový projekt</button>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="container-fluid kanban-container py-4 px-0">
                    <div className="row d-flex flex-nowrap">
                        {projectStatuses.map((projectStatus, projectStatus_index) => (
                            <ProjectsKanbanColumn key={projectStatus.id}
                                                  setReload={setReload}
                                                  projects={projects[projectStatus.id]}
                                                  projectStatus={projectStatus}
                                                  clients={clients}
                                                  endCustomers={endCustomers}
                                                  moveCard={moveCard}/>
                        ))}
                    </div>
                </div>
            </DndProvider>

                {modalIsOpen && (
                    <ProjectFormModal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        callback={()=>setReload(true)}/>
                )}
        </>
    );
};

export default ProjectsKanban;