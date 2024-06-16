import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import EndCustomerContactsList from "../components/EndCustomerContacts/EndCustomerContactsList";
import EndCustomerContactNew from "../components/EndCustomerContacts/EndCustomerContactNew";
import EndCustomerContactEdit from "../components/EndCustomerContacts/EndCustomerContactEdit";

const EndCustomerContact = ({}) => {
    useEffect(() => {
        document.title = "Koncový zákazníci - kontakty";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<EndCustomerContactEdit/>}/>
            <Route path="new" element={<EndCustomerContactNew/>}/>
            <Route path="*" element={<EndCustomerContactsList/>}/>
        </Routes>
    );
}

export default EndCustomerContact;