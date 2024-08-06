import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

import BudgetCalculator from "../../utils/BudgetCalculator";
import {FilePdf, Pencil, Plus, Trash} from "@phosphor-icons/react";
import ClientFormModal from "../Clients/ClientFormModal";
import CostFormModal from "./CostFormModal";
import CostsOverview from "./CostsOverview";
import CostsChart from "./CostsChart";

const CostsList = ({}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [costs, setCosts] = useState([]);
    const [costCategories, setCostCategories] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear())
    const actualYear = new Date().getFullYear();
    const years = Array.from({length: 20}, (x, i) => actualYear - i);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalCostId, setModalCostId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        API.getData("/cost/list?order=day_of_accounting%20DESC", (costs) => {
            setCosts(costs);
        });

        API.getData("/costCategory/list?order=name", (costCategories) => {
            setCostCategories(costCategories);
        });

        setReload(false);
    }, [reload]);

    function handleDelete(id) {
        API.getData("/cost/delete/" + id, () => {
            setReload(true);
        });
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Náklady</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalCostId(null);
                    setIsOpen(true)
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nový náklad
                </button>
            </div>

            {costs && costs.length > 0 && (
                <>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <select className="form-select mb-3" defaultValue={year}
                                            onChange={(e) => setYear(e.target.value)}>
                                        {years.map((y) => (
                                            <option value={y} key={y}>{y}</option>
                                        ))}
                                    </select>

                                    <CostsOverview costCategories={costCategories} costs={costs} year={year}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 mb-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <CostsChart costs={costs} year={year}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0 rounded">
                                    <thead className="thead-light">
                                    <tr>
                                        <th className="border-0 rounded-start">#</th>
                                        <th className="border-0">Název</th>
                                        <th className="border-0">Popis</th>
                                        <th className="border-0">Kategorie</th>
                                        <th className="border-0">Datum zaúčtování</th>
                                        <th className="border-0">Částka</th>
                                        <th className="border-0 rounded-end">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {costs.map((cost, cost_key) => (
                                        <tr key={cost_key}>
                                            <td><span  role="presentation"  onClick={() => {
                                                setIsOpen(true);
                                                setModalCostId(cost.id);
                                            }} className="cursor-pointer fw-bold">{cost.id}</span></td>
                                            <td className="fw-bold ">
                                                {cost.name}
                                            </td>
                                            <td>
                                                {cost.description.substring(0, 20)}
                                                {cost.description.length > 20 && ("...")}
                                            </td>
                                            <td> {costCategories?.filter(costCategory => costCategory.id == cost.costCategoryId)[0]?.name}</td>
                                            <td> {cost.dayOfAccounting?.date?.substring(0, 10)}</td>
                                            <td className="text-end"> {(new BudgetCalculator)._numberFormat(cost.amount, 2, ".", " ")} Kč</td>
                                            <td>
                                                <button onClick={() => {
                                                    setIsOpen(true);
                                                    setModalCostId(cost.id);
                                                }}
                                                        className="btn btn-sm btn-primary" type="button">
                                                    <Pencil/>
                                                </button>
                                                &nbsp;
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(cost.id)}
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
                <CostFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={() => {setIsOpen(false); setReload(true)}}
                    id={modalCostId}/>
            )}
        </>
    );
};

export default CostsList;