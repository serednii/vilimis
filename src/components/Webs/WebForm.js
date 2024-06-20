import React from "react";
import WebFormDefault from "./WebFormDefault";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CommentsList from "../Comments/CommentsList";

const WebForm = ({id, handleSave}) => {

    return (
        <>
            {id ? (
                <Tabs>
                    <TabList>
                        <Tab>Nastavení</Tab>
                        <Tab>Poznámky</Tab>
                    </TabList>


                    <TabPanel>
                        <WebFormDefault id={id} handleSave={handleSave}/>
                    </TabPanel>

                    <TabPanel>
                        <CommentsList entity="web" entityId={id} />
                    </TabPanel>
                </Tabs>
            ) : (
                <WebFormDefault handleSave={handleSave}/>
            )}
        </>
    );
};

export default WebForm;