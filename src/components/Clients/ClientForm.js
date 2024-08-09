import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import InvoiceFormDefault from "../Invoices/InvoiceFormDefault";
import InvoiceItemsList from "../InvoiceItems/InvoiceItemsList";
import CommentsList from "../Comments/CommentsList";
import ClientFormDefault from "./ClientFormDefault";
import SessionsList from "../Sessions/SessionsList";
import ProjectsList from "../Projects/ProjectsList";
import AttachmentsList from "../Attachment/AttachmentsList";
import LicensesList from "../Licenses/LicensesList";

const clientBlank = {
    name: "",
    address: "",
    ic: "",
    dic: "",
    email: "",
    phone: "",
    web: "",
    hourRate: "",
    logo: "",
}

const ClientForm = ({id, handleSave}) => {
    const {API} = useRootContext()

    return (
        <>
            <>
                {id ? (
                    <Tabs>
                        <TabList>
                            <Tab>Nastavení</Tab>
                            <Tab>Projekty</Tab>
                            <Tab>Setkání</Tab>
                            <Tab>Licence</Tab>
                            <Tab>Poznámky</Tab>
                            <Tab>Přílohy</Tab>
                        </TabList>


                        <TabPanel>
                            <ClientFormDefault id={id} handleSave={handleSave}/>
                        </TabPanel>

                        <TabPanel>
                            <ProjectsList clientId={id}/>
                        </TabPanel>

                        <TabPanel>
                            <SessionsList clientId={id}/>
                        </TabPanel>

                        <TabPanel>
                            <LicensesList clientId={id} />
                        </TabPanel>

                        <TabPanel>
                            <CommentsList entity="client" entityId={id} />
                        </TabPanel>

                        <TabPanel>
                            <AttachmentsList entity="client" entityId={id} />
                        </TabPanel>
                    </Tabs>
                ) : (
                    <ClientFormDefault handleSave={handleSave}/>
                )}
            </>
        </>
    );
};

export default ClientForm;