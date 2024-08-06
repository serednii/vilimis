import React from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CommentsList from "../Comments/CommentsList";
import CostFormDefault from "./CostFormDefault";
import SessionsList from "../Sessions/SessionsList";
import ProjectsList from "../Projects/ProjectsList";
import AttachmentsList from "../Attachment/AttachmentsList";


const CostForm = ({id, handleSave}) => {
    return (
        <>
            <>
                {id ? (
                    <Tabs>
                        <TabList>
                            <Tab>Nastavení</Tab>
                            <Tab>Přílohy</Tab>
                        </TabList>


                        <TabPanel>
                            <CostFormDefault id={id} handleSave={handleSave}/>
                        </TabPanel>

                        <TabPanel>
                            <AttachmentsList entity="cost" entityId={id} />
                        </TabPanel>
                    </Tabs>
                ) : (
                    <CostFormDefault handleSave={handleSave}/>
                )}
            </>
        </>
    );
};

export default CostForm;