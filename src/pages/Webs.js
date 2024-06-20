import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import WebsList from "../components/Webs/WebsList";
import WebNew from "../components/Webs/WebNew";
import WebEdit from "../components/Webs/WebEdit";

const Webs = ({}) => {
    useEffect(() => {
        document.title = "Weby";
    }, []);

    return (
        <Routes>
            <Route path="edit/:id" element={<WebEdit/>}/>
            <Route path="new" element={<WebNew/>}/>
            <Route path="*" element={<WebsList/>}/>
        </Routes>
    );
}

export default Webs;