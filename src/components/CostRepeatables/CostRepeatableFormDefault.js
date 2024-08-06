import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import CostCategoriesSelectList from "../CostCategories/CostCategoriesSelectList";

const costRepeatableBlank = {
    name: "",
    description: "",
    costCategoryId: "",
    amount: 0,
    dayOfAccounting: 1,
    firstDayOfAccounting: null,
    frequency: "monthly",
    costRepeatableRepeatableId: "",
}

const CostRepeatableFormDefault = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [costRepeatable, setCostRepeatable] = useState(null);
    const [selectedCostCategoryId, setSelectedCostCategoryId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/costRepeatable/single/" + id, (data) => {
                setCostRepeatable(data);
            });
        } else {
            costRepeatableBlank.firstDayOfAccounting = {date: new Date().toISOString()}

            setCostRepeatable(costRepeatableBlank)
        }
    }, [id]);

    function handleDelete(id) {
        API.getData("/costRepeatable/delete/"+id, ()=>{
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

        API.postData("/costRepeatable/save", formData, (data) => {
            setCostRepeatable(data.costRepeatable);

            if (handleSave) {
                handleSave(data.costRepeatable);
            }
        });
    }

    return (
        <>
            {costRepeatable && "name" in costRepeatable && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="costRepeatable_repeatable_id"
                           value={costRepeatable.costRepeatableRepeatableId}/>

                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={costRepeatable.name} type="text" name="name"
                               className="form-control form-control-lg"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_costRepeatable_category_id">Kategorie</label>
                        <CostCategoriesSelectList selected={costRepeatable.costCategoryId}
                                                  onChange={setSelectedCostCategoryId}/>
                        <input type="hidden" name="cost_category_id"
                               value={selectedCostCategoryId ? selectedCostCategoryId : 0}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_description">Popis</label>
                        <textarea defaultValue={costRepeatable.description} className="form-control" name="description"
                                  rows="10"
                                  id="form_edit_description"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_frequency">Frekvence</label>
                        <select id="form_edit_frequency" className="form-select" name="frequency"
                                defaultValue={costRepeatable.frequency}>
                            <option value="monthly">Měsíčně</option>
                        </select>
                    </div>
                    {costRepeatable.frequency === "monthly" && (
                        <div className="mb-3">
                            <label htmlFor="form_edit_day_of_accounting">Den zaúčtování</label>
                            <select id="form_edit_day_of_accounting" className="form-select"
                                    name="day_of_accounting"
                                    defaultValue={costRepeatable.dayOfAccounting}>
                                {[...Array(28).keys()].map((n)=>(
                                    <option key={n} value={n+1}>{n+1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="form_edit_day_of_accounting">Datum spuštění</label>
                        <input defaultValue={costRepeatable.firstDayOfAccounting?.date.substring(0, 10)} type="date"
                               name="first_day_of_accounting"
                               className="form-control"
                               id="form_edit_day_of_accounting"></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_amount">Částka</label>
                        <input defaultValue={costRepeatable.amount} type="number" name="amount"
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

export default CostRepeatableFormDefault;