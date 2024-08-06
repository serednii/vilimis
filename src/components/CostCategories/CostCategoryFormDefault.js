import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";

const costCategoryBlank = {
    name: "",
    color: "",
}

const CostCategoryFormDefault = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [costCategory, setCostCategory] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/costCategory/single/" + id, (data) => {
                setCostCategory(data);
            });
        } else {
            setCostCategory(costCategoryBlank)
        }
    }, [id]);

    function handleDelete(id) {
        API.getData("/costCategory/delete/"+id, ()=>{
            if (handleSave) {
                handleSave();
            }
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/costCategory/save", formData, (data) => {
            setCostCategory(data.costCategory);

            if (handleSave) {
                handleSave(data.costCategory);
            }
        });
    }

    return (
        <>
            {costCategory && "name" in costCategory && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={costCategory.name} type="text" name="name" className="form-control form-control-lg"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_color">Barva</label>
                        <input defaultValue={costCategory.color} type="text" name="color" className="form-control"
                               id="form_edit_color"/>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>

                    {!!id && (
                        <button
                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(id)}
                            className="btn btn-danger float-end" type="button">Smazat</button>
                    )}
                </form>
            )}
        </>
    );
};

export default CostCategoryFormDefault;