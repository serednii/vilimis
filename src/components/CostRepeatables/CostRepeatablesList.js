import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import BudgetCalculator from "../../utils/BudgetCalculator";
import {FilePdf, Pencil, Plus, Trash} from "@phosphor-icons/react";
import CostRepeatableFormModal from "../CostRepeatables/CostRepeatableFormModal";

const CostRepeatablesList = ({}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [costRepeatables, setCostRepeatables] = useState([]);
    const [costCategories, setCostCategories] = useState([]);
    const [amount, setAmount] = useState(0)
    const actualYear = new Date().getFullYear();
    const years = Array.from({length: 20}, (x, i) => actualYear - i);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalCostRepeatableId, setModalCostRepeatableId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        API.getData("/costRepeatable/list?order=name", (costRepeatables) => {
            setCostRepeatables(costRepeatables);

            let tmpAmount = amount;
            costRepeatables.forEach(costRepeatable => {
                tmpAmount += parseFloat(costRepeatable.amount);
                setAmount(tmpAmount);
            });
        });

        API.getData("/costCategory/list?order=name", (costCategories) => {
            setCostCategories(costCategories);
        });

        setReload(false);
    }, [reload]);

    function handleDelete(id) {
        API.getData("/costRepeatable/delete/" + id, () => {
            setReload(true);
        });
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Opakované náklady</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalCostRepeatableId(null);
                    setIsOpen(true)
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nový opakovaný náklad
                </button>
            </div>

            {costRepeatables && costRepeatables.length > 0 && (
                <>
                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <h2 className="h5 mb-3">
                            Celkem: {(new BudgetCalculator)._numberFormat(amount, 2, ".", " ")} Kč
                            </h2>
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0 rounded">
                                    <thead className="thead-light">
                                    <tr>
                                        <th className="border-0 rounded-start">#</th>
                                        <th className="border-0">Název</th>
                                        <th className="border-0">Popis</th>
                                        <th className="border-0">Kategorie</th>
                                        <th className="border-0">Den zaúčtování</th>
                                        <th className="border-0">Spuštěné od</th>
                                        <th className="border-0">Částka</th>
                                        <th className="border-0 rounded-end">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {costRepeatables.map((costRepeatable, costRepeatable_key) => (
                                        <tr key={costRepeatable_key}>
                                            <td><span  role="presentation"  onClick={() => {
                                                setIsOpen(true);
                                                setModalCostRepeatableId(costRepeatable.id);
                                            }} className="cursor-pointer fw-bold">{costRepeatable.id}</span></td>
                                            <td className="fw-bold ">
                                                {costRepeatable.name}
                                            </td>
                                            <td>
                                                {costRepeatable.description}
                                            </td>
                                            <td> {costCategories?.filter(costCategory => costCategory.id == costRepeatable.costCategoryId)[0]?.name}</td>
                                            <td> {costRepeatable.dayOfAccounting}</td>
                                            <td> {costRepeatable.firstDayOfAccounting?.date?.substring(0, 10)}</td>
                                            <td className="text-end"> {(new BudgetCalculator)._numberFormat(costRepeatable.amount, 2, ".", " ")} Kč</td>
                                            <td>
                                                <button onClick={() => {
                                                    setIsOpen(true);
                                                    setModalCostRepeatableId(costRepeatable.id);
                                                }}
                                                        className="btn btn-sm btn-primary" type="button">
                                                    <Pencil/>
                                                </button>
                                                &nbsp;
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(costRepeatable.id)}
                                                    className="btn btn-sm btn-danger" type="button">
                                                    <Trash/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalIsOpen && (
                <CostRepeatableFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={() => {setIsOpen(false); setReload(true)}}
                    id={modalCostRepeatableId}/>
            )}
        </>
    );
};

export default CostRepeatablesList;