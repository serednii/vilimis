import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import InvoicesList from "../components/Invoices/InvoicesList";
import InvoiceNew from "../components/Invoices/InvoiceNew";
import InvoiceEdit from "../components/Invoices/InvoiceEdit";

const Invoices = ({}) => {
    useEffect(() => {
        document.title = "Faktury";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<InvoiceEdit/>}/>
            <Route path="new" element={<InvoiceNew/>}/>
            <Route path="*" element={<InvoicesList/>}/>
        </Routes>
    );
}

export default Invoices;