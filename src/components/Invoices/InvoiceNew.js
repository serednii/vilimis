import React from "react";
import {useNavigate} from "react-router-dom";
import InvoiceForm from "./InvoiceForm";

const InvoiceNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(invoice) {
        if (invoice && "id" in invoice) {
            const id = invoice.id;
            navigate("/invoices/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový invoice</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <InvoiceForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default InvoiceNew;