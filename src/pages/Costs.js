import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import CostsList from "../components/Costs/CostsList";
import CostCategoriesList from "../components/CostCategories/CostCategoriesList";
import CostRepeatablesList from "../components/CostRepeatables/CostRepeatablesList";

const Cost = ({}) => {
    useEffect(() => {
        document.title = "Náklady";
    }, []);

    return (
        <Routes>
            <Route path="repeatables" element={<CostRepeatablesList/>}/>
            <Route path="categories" element={<CostCategoriesList/>}/>
            <Route path="*" element={<CostsList/>}/>
        </Routes>
    );
}

export default Cost;