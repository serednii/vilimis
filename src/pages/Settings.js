import React, {useEffect} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import SettingsBaseForm from "../components/Settings/SettingsBaseForm";
import SettingsTasksForm from "../components/Settings/SettingsTasksForm";

const Settings = ({}) => {

    useEffect(() => {
        document.title = "Nastavení";
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3"><h1 className="h4">Nastavení</h1></div>
            </div>

            <Tabs>
                <TabList>
                    <Tab>Základní nastavení</Tab>
                    <Tab>Úkoly</Tab>
                </TabList>

                <TabPanel>
                    <SettingsBaseForm/>
                </TabPanel>

                <TabPanel>
                    <SettingsTasksForm/>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Settings;