import React from "react";
import TaskFormDefault from "./TaskFormDefault";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TaskFormTimeTracks from "./TaskFormTimeTracks";

const TaskForm = ({id, handleSave}) => {

    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>Nastavení</Tab>
                    <Tab>Časové záznamy</Tab>
                </TabList>


                <TabPanel>
                    <TaskFormDefault id={id} handleSave={handleSave}/>
                </TabPanel>

                <TabPanel>
                    <TaskFormTimeTracks taskId={id} />
                </TabPanel>
            </Tabs>
        </>
    );
};

export default TaskForm;