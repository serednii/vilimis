import React from "react";
import TaskFormDefault from "./TaskFormDefault";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TaskFormTimeTracks from "./TaskFormTimeTracks";
import CommentsList from "../Comments/CommentsList";
import AttachmentsList from "../Attachment/AttachmentsList";
import ChecklistsList from "../Checklists/ChecklistsList";

const TaskForm = ({ id, handleSave, projectId }) => {

    return (
        <>
            {id ? (
                <Tabs>
                    <TabList>
                        <Tab>Nastavení</Tab>
                        <Tab>Časové záznamy</Tab>
                        <Tab>Checklisty</Tab>
                        <Tab>Poznámky</Tab>
                        <Tab>Přílohy</Tab>
                    </TabList>

                    <TabPanel>
                        <TaskFormDefault id={id} handleSave={handleSave} />
                    </TabPanel>

                    <TabPanel>
                        <TaskFormTimeTracks taskId={id} />
                    </TabPanel>

                    <TabPanel>
                        <ChecklistsList taskId={id}/>
                    </TabPanel>

                    <TabPanel>
                        <CommentsList entity="task" entityId={id} />
                    </TabPanel>

                    <TabPanel>
                        <AttachmentsList entity="task" entityId={id} />
                    </TabPanel>
                </Tabs>
            ) : (
                <TaskFormDefault projectId={projectId} handleSave={handleSave} />
            )}
        </>
    );
};

export default TaskForm;