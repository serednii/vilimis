import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import ChecklistsList from "../components/Checklists/ChecklistsList";

const Checklists = ({}) => {
    useEffect(() => {
        document.title = "Checklisty";
    }, []);

    return (
        <>
            <ChecklistsList/>
        </>
    );
}

export default Checklists;