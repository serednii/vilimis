import React from "react";
import {useRootContext} from "../../contexts/RootContext";
import CostCategoryFormDefault from "./CostCategoryFormDefault";

const CostCategoryForm = ({id, handleSave}) => {
    const {API} = useRootContext()

    return (
        <>
                <CostCategoryFormDefault id={id} handleSave={handleSave}/>
        </>
    );
};

export default CostCategoryForm;