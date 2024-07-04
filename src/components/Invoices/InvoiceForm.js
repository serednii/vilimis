import React from "react";
import InvoiceFormDefault from "./InvoiceFormDefault";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CommentsList from "../Comments/CommentsList";
import InvoiceItemsList from "../InvoiceItems/InvoiceItemsList";

const InvoiceForm = ({id, handleSave}) => {

    return (
        <>
            {id ? (
                <Tabs>
                    <TabList>
                        <Tab>Nastavení</Tab>
                        <Tab>Položky</Tab>
                        <Tab>Poznámky</Tab>
                    </TabList>


                    <TabPanel>
                        <InvoiceFormDefault id={id} handleSave={handleSave}/>
                    </TabPanel>

                    <TabPanel>
                        <InvoiceItemsList invoiceId={id} />
                    </TabPanel>

                    <TabPanel>
                        <CommentsList entity="invoice" entityId={id} />
                    </TabPanel>
                </Tabs>
            ) : (
                <InvoiceFormDefault handleSave={handleSave}/>
            )}
        </>
    );
};

export default InvoiceForm;