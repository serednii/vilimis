import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import LicensesList from "../components/Licenses/LicensesList";

const Cost = ({}) => {
    useEffect(() => {
        document.title = "Licence";
    }, []);

    return (
        <Routes>
            <Route path="*" element={<LicensesList/>}/>
        </Routes>
    );
}

export default Cost;