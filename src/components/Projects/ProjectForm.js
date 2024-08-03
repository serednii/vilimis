import React from "react";
import ProjectFormDefault from "./ProjectFormDefault";
import ProjectDatesList from "../ProjectDates/ProjectDatesList";
import SessionsList from "../Sessions/SessionsList";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CommentsList from "../Comments/CommentsList";
import AttachmentsList from "../Attachment/AttachmentsList";
import TasksList from "../Tasks/TasksList";
import ChecklistsList from "../Checklists/ChecklistsList";

const ProjectForm = ({id, handleSave, clientId}) => {
    return (
        <>
            {id && id > 0 ? (
                <Tabs>
                    <TabList>
                        <Tab>Nastavení</Tab>
                        <Tab>Úkoly</Tab>
                        <Tab>Checklisty</Tab>
                        <Tab>Poznámky</Tab>
                        <Tab>Přílohy</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h5>Nastavení</h5>
                                <ProjectFormDefault id={id} handleSave={handleSave}/>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                <div className="col-12 col-md-6">
                                    <h5>Data projektu</h5>
                                    <ProjectDatesList projectId={id}/>
                                </div>
                                <div className="col-12 col-md-6">
                                    <h5>Setkání</h5>
                                    <SessionsList projectId={id}/>
                                </div>
                                </div>
                            </div>
                            </div>
                    </TabPanel>

                    <TabPanel>
                        <TasksList projectId={id}/>
                    </TabPanel>

                    <TabPanel>
                        <ChecklistsList projectId={id}/>
                    </TabPanel>

                    <TabPanel>
                        <CommentsList entity="project" entityId={id} />
                    </TabPanel>

                    <TabPanel>
                        <AttachmentsList entity="project" entityId={id} />
                    </TabPanel>
                </Tabs>
            ) : (
                <ProjectFormDefault clientId={clientId} id={id} handleSave={handleSave}/>
            )}
        </>
    );
};

export default ProjectForm;