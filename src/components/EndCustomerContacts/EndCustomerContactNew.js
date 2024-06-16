import React from "react";
import {useNavigate} from "react-router-dom";
import EndCustomerContactForm from "./EndCustomerContactForm";

const EndCustomerContactNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(endCustomerContact) {
        if (endCustomerContact && "id" in endCustomerContact) {
            const id = endCustomerContact.id;
            navigate("/end-customer-contacts/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový koncový zákazník - kontakt</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <EndCustomerContactForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default EndCustomerContactNew;