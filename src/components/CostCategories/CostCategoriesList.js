import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";
import {Pencil, Plus, Trash} from "@phosphor-icons/react";
import CostCategoryFormModal from "./CostCategoryFormModal";

const CostCategoriesList = ({}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [costCategories, setCostCategories] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear())
    const actualYear = new Date().getFullYear();
    const years = Array.from({length: 20}, (x, i) => actualYear - i);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalCostCategoryId, setModalCostCategoryId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        API.getData("/costCategory/list?order=name", (costCategories) => {
            setCostCategories(costCategories);
        });

        setReload(false);
    }, [reload]);

    function handleDelete(id) {
        API.getData("/costCategory/delete/" + id, () => {
            setReload(true);
        });
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Kategorie nákladů</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalCostCategoryId(null);
                    setIsOpen(true)
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nová kategorie
                </button>
            </div>

            {costCategories && costCategories.length > 0 && (
                <>

                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0 rounded">
                                    <thead className="thead-light">
                                    <tr>
                                        <th className="border-0 rounded-start">#</th>
                                        <th className="border-0">Název</th>
                                        <th className="border-0">Barva</th>
                                        <th className="border-0 rounded-end">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {costCategories.map((costCategory, costCategory_key) => (
                                        <tr key={costCategory_key}>
                                            <td><span  role="presentation"  onClick={() => {
                                                setIsOpen(true);
                                                setModalCostCategoryId(costCategory.id);
                                            }} className="cursor-pointer fw-bold">{costCategory.id}</span></td>
                                            <td className="fw-bold ">
                                                {costCategory.name}
                                            </td>
                                            <td>
                                                {costCategory.color}
                                            </td>
                                            <td>
                                                <button onClick={() => {
                                                    setIsOpen(true);
                                                    setModalCostCategoryId(costCategory.id);
                                                }}
                                                        className="btn btn-sm btn-primary" type="button">
                                                    <Pencil/>
                                                </button>
                                                &nbsp;
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(costCategory.id)}
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
                <CostCategoryFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={() => {setIsOpen(false); setReload(true)}}
                    id={modalCostCategoryId}/>
            )}
        </>
    );
};

export default CostCategoriesList;