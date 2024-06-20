import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import ClientContactsList from "../components/ClientContacts/ClientContactsList";
import ClientContactNew from "../components/ClientContacts/ClientContactNew";
import ClientContactEdit from "../components/ClientContacts/ClientContactEdit";

const ClientContact = ({}) => {
    useEffect(() => {
        document.title = "Koncový zákazníci - kontakty";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<ClientContactEdit/>}/>
            <Route path="new" element={<ClientContactNew/>}/>
            <Route path="*" element={<ClientContactsList/>}/>
        </Routes>
    );
}

export default ClientContact;