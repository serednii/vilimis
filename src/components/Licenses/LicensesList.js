import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

import BudgetCalculator from "../../utils/BudgetCalculator";
import {ArrowBendUpRight, Pencil, Plus, Trash} from "@phosphor-icons/react";
import LicenseFormModal from "./LicenseFormModal";

const LicensesList = ({projectId, clientId, endCustomerId}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [licenses, setLicenses] = useState([]);
    const [beforeLicenseId, setBeforeLicenseId] = useState(null);
    const [afterLicenseId, setAfterLicenseId] = useState(null);
    const actualYear = new Date().getFullYear();

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalLicenseId, setModalLicenseId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        let url = "/license/list?order=date_to%20DESC";
        if (clientId) {
            url += "&filter[client_id]=" + clientId;
        }
        if (projectId) {
            url += "&filter[project_id]=" + projectId;
        }
        if (endCustomerId) {
            url += "&filter[end_customer_id]=" + endCustomerId;
        }
        API.getData(url, (licenses) => {
            setLicenses(licenses);
        });

        setReload(false);
    }, [reload]);

    function handleDelete(id) {
        API.getData("/license/delete/" + id, () => {
            setReload(true);
        });
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Licence</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setBeforeLicenseId(null);
                    setAfterLicenseId(null);
                    setModalLicenseId(null);
                    setIsOpen(true);
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nová licence
                </button>
            </div>

            {licenses && licenses.length > 0 && (
                <>
                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0 rounded">
                                    <thead className="thead-light">
                                    <tr>
                                        <th className="border-0 rounded-start">#</th>
                                        <th className="border-0">Název</th>
                                        <th className="border-0">Platnost od</th>
                                        <th className="border-0">Platnost do</th>
                                        <th className="border-0">Částka</th>
                                        <th className="border-0 rounded-end">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {licenses.map((license, license_key) => (
                                        <tr key={license_key}>
                                            <td><span  role="presentation"  onClick={() => {
                                                setIsOpen(true);
                                                setModalLicenseId(license.id);
                                            }} className="cursor-pointer fw-bold">{license.id}</span></td>
                                            <td className="fw-bold ">
                                                {license.name}
                                            </td>
                                            <td> {license.dateFrom?.date?.substring(0, 10)}</td>
                                            <td> {license.dateTo?.date?.substring(0, 10)}</td>
                                            <td className="text-end"> {(new BudgetCalculator)._numberFormat(license.amount, 2, ".", " ")} Kč</td>
                                            <td>
                                                <button onClick={() => {
                                                    setModalLicenseId(0);
                                                    setBeforeLicenseId(license.id);
                                                    setAfterLicenseId(null);
                                                    setIsOpen(true);
                                                }}
                                                        title="Vytvořit navazující licenci"
                                                        className="btn btn-sm btn-secondary" type="button">
                                                    <ArrowBendUpRight/>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => {
                                                    setModalLicenseId(license.id);
                                                    setBeforeLicenseId(null);
                                                    setAfterLicenseId(null);
                                                    setIsOpen(true);
                                                }}
                                                        className="btn btn-sm btn-primary" type="button">
                                                    <Pencil/>
                                                </button>
                                                &nbsp;
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(license.id)}
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
                <LicenseFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={() => {setIsOpen(false); setReload(true)}}
                    projectId={projectId}
                    endCustomerId={endCustomerId}
                    clientId={clientId}
                    afterLicenseId={afterLicenseId}
                    beforeLicenseId={beforeLicenseId}
                    id={modalLicenseId}/>
            )}
        </>
    );
};

export default LicensesList;