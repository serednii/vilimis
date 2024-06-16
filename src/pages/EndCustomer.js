import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import EndCustomersList from "../components/EndCustomers/EndCustomersList";
import EndCustomerNew from "../components/EndCustomers/EndCustomerNew";
import EndCustomerEdit from "../components/EndCustomers/EndCustomerEdit";

const EndCustomer = ({}) => {
    useEffect(() => {
        document.title = "Koncový zákazníci";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<EndCustomerEdit/>}/>
            <Route path="new" element={<EndCustomerNew/>}/>
            <Route path="*" element={<EndCustomersList/>}/>
        </Routes>
    );
}

export default EndCustomer;