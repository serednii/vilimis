import React from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CostRepeatableFormDefault from "./CostRepeatableFormDefault";
import AttachmentsList from "../Attachment/AttachmentsList";
import {useRootContext} from "../../contexts/RootContext";


const CostRepeatableForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    function handleAddFromBeginningYear(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData();

        if (id) {
            formData.append("id", id);
        }

        API.postData("/costRepeatableAddFromBeginningYear/save", formData);
    }

    return (
        <>
            <>
                {id ? (
                    <Tabs>
                        <TabList>
                            <button onClick={handleAddFromBeginningYear} className="btn btn-primary btn-sm float-end">Generovat náklady zpětně od začátku roku, pokud chybí</button>

                            <Tab>Nastavení</Tab>
                            <Tab>Přílohy</Tab>
                        </TabList>


                        <TabPanel>
                            <CostRepeatableFormDefault id={id} handleSave={handleSave}/>
                        </TabPanel>

                        <TabPanel>
                            <AttachmentsList entity="costRepeatable" entityId={id} />
                        </TabPanel>
                    </Tabs>
                ) : (
                    <CostRepeatableFormDefault handleSave={handleSave}/>
                )}
            </>
        </>
    );
};

export default CostRepeatableForm;