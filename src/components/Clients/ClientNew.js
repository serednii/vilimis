import React from "react";
import {useNavigate} from "react-router-dom";
import ClientForm from "./ClientForm";

const ClientNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(client) {
        const id = client.id;
        navigate("/clients/edit/"+id);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový klient</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <ClientForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default ClientNew;