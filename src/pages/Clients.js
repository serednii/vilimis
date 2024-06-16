import React, {useEffect} from "react";
import Entity from "../components/Entity/Entity";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NoPage from "./NoPage";
import EntityEdit from "../components/Entity/EntityEdit";
import ClientsList from "../components/Clients/ClientsList";
import ClientNew from "../components/Clients/ClientNew";
import ClientEdit from "../components/Clients/ClientEdit";

const Client = ({}) => {
    useEffect(() => {
        document.title = "Klienti";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<ClientEdit/>}/>
            <Route path="new" element={<ClientNew/>}/>
            <Route path="*" element={<ClientsList/>}/>
        </Routes>
    );
}

export default Client;