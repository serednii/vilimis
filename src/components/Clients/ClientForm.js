import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import InvoiceFormDefault from "../Invoices/InvoiceFormDefault";
import InvoiceItemsList from "../InvoiceItems/InvoiceItemsList";
import CommentsList from "../Comments/CommentsList";
import ClientFormDefault from "./ClientFormDefault";
import SessionsList from "../Sessions/SessionsList";

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
                            <Tab>Setkání</Tab>
                            <Tab>Poznámky</Tab>
                        </TabList>


                        <TabPanel>
                            <ClientFormDefault id={id} handleSave={handleSave}/>
                        </TabPanel>

                        <TabPanel>
                            <SessionsList clientId={id}/>
                        </TabPanel>

                        <TabPanel>
                            <CommentsList entity="client" entityId={id} />
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