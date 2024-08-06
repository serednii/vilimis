import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import CostCategoriesSelectList from "../CostCategories/CostCategoriesSelectList";

const costBlank = {
    name: "",
    description: "",
    costCategoryId: "",
    amount: 0,
    dayOfAccounting: null,
    costRepeatableId: "",
}

const CostFormDefault = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [cost, setCost] = useState(null);
    const [selectedCostCategoryId, setSelectedCostCategoryId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/cost/single/" + id, (data) => {
                setCost(data);
            });
        } else {
            costBlank.dayOfAccounting = {date: new Date().toISOString()}

            setCost(costBlank)
        }
    }, [id]);

    function handleDelete(id) {
        API.getData("/cost/delete/"+id, ()=>{
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

        API.postData("/cost/save", formData, (data) => {
            setCost(data.cost);

            if (handleSave) {
                handleSave(data.cost);
            }
        });
    }

    return (
        <>
            {cost && "name" in cost && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="cost_repeatable_id" value={cost.costRepeatableId}/>

                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={cost.name} type="text" name="name" className="form-control form-control-lg"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_cost_category_id">Kategorie</label>
                        <CostCategoriesSelectList selected={cost.costCategoryId} onChange={setSelectedCostCategoryId}/>
                        <input type="hidden" name="cost_category_id" value={selectedCostCategoryId ? selectedCostCategoryId : 0}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_description">Popis</label>
                        <textarea defaultValue={cost.description} className="form-control" name="description"
                                  rows="10"
                                  id="form_edit_description"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_day_of_accounting">Datum zaúčotvání</label>
                        <input defaultValue={cost.dayOfAccounting?.date.substring(0, 10)} type="date"
                               name="day_of_accounting"
                               className="form-control"
                               id="form_edit_day_of_accounting"></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_amount">Částka</label>
                        <input defaultValue={cost.amount} type="number" name="amount"
                               step="0.01"
                               className="form-control"
                               id="form_edit_amount"/>
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

export default CostFormDefault;