import React from "react";
import {useNavigate} from "react-router-dom";
import CostCategoryForm from "./CostCategoryForm";

const CostCategoryNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(costCategory) {
        const id = costCategory.id;
        navigate("/costCategories/edit/"+id);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový klient</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <CostCategoryForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default CostCategoryNew;