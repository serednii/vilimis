import React from "react";
import {useNavigate} from "react-router-dom";
import WebForm from "./WebForm";

const WebNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(web) {
        if (web && "id" in web) {
            const id = web.id;
            navigate("/webs/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový web</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <WebForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default WebNew;