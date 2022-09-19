import React from "react";
import Entity from "../components/Entity/Entity";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NoPage from "./NoPage";
import EntityEdit from "../components/Entity/EntityEdit";

class EntityPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "Entity";
    }

    render() {
        return (
            <Routes>
                <Route path="edit/:id" element={<EntityEdit/>}/>
                <Route path="*" element={<Entity/>}/>
            </Routes>
        );
    }
}

export default EntityPage;