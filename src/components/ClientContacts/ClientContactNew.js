import React from "react";
import {useNavigate} from "react-router-dom";
import ClientContactForm from "./ClientContactForm";

const ClientContactNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(clientContact) {
        if (clientContact && "id" in clientContact) {
            const id = clientContact.id;
            navigate("/client-contacts/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový klient - kontakt</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <ClientContactForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default ClientContactNew;