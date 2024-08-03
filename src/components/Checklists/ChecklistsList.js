// noinspection HtmlUnknownAttribute

import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ChecklistFormModal from "./ChecklistFormModal";
import {Copy, Plus, Trash} from "@phosphor-icons/react";
import ChecklistCloneModal from "./ChecklistCloneModal";

const ChecklistsList = ({projectId, taskId}) => {
    const {API} = useRootContext()
    const [checklists, setChecklists] = useState([]);
    const [reload, setReload] = useState(true);
    const [checklistsLoading, setChecklistsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState(0);


    useEffect(() => {
        if (!reload) return;

        setChecklistsLoading(true);

        let url = "/checklist/list?order=name";

        if (projectId) {
            url += "&filter[project_id]=" + encodeURIComponent(projectId);
        }

        if (taskId) {
            url += "&filter[task_id]=" + encodeURIComponent(taskId);
        }

        API.getData(url, (checklists) => {
            setChecklists(checklists);
            setChecklistsLoading(false);
        });

        setReload(false);
    }, [reload, taskId, projectId]);

    const [cloneModalIsOpen, setCloneModalIsOpen] = React.useState(false);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalChecklistId, setModalChecklistId] = React.useState(0);

    function closeModal() {
        setModalIsOpen(false);
    }
    function closeCloneModal() {
        setCloneModalIsOpen(false);
    }

    function handleDelete(id, noreload) {
        API.getData("/checklist/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    if (checklistsLoading) {
        return ("Načítání...");
    }

    let checklistUtil = null;
    let budgetUtil = null;

    const handleBulkAction = () => {
        switch (bulkAction) {
            case "delete":
                selectedIds.forEach(id => {
                    handleDelete(id, true)
                });
                setReload(true);
                break;
        }
    }

    return (
        <>

            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Checklisty</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalIsOpen(true);
                    setModalChecklistId(null);
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={16} className="me-2"/>
                    Nový checklist
                </button>

                <button onClick={() => {
                    setCloneModalIsOpen(true);
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Copy size={16} className="me-2"/>
                    Klonovat z jiného
                </button>
            </div>

            {checklists?.length > 0 ? (
                <>
                    <div className="d-flex mb-3"><select className="form-select fmxw-200"
                                                         disabled={selectedIds.length === 0}
                                                         defaultValue=""
                                                         onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Hromadná akce</option>
                        <option value="delete">Smazat</option>
                    </select>
                        <button disabled={selectedIds.length === 0}
                                onClick={handleBulkAction}
                                className="btn btn-sm px-3 btn-secondary ms-3">Provést
                        </button>
                    </div>

                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table class="table table-hover align-items-center">
                                    <thead>
                                    <tr>
                                        <td style={{maxWidth: "15px", width: "15px", minWidth: "15px"}}
                                            className="p-0 ps-2 border-bottom">
                                            <div className="form-check dashboard-check">
                                                <input className="form-check-input" type="checkbox" id="item_all"
                                                       onClick={(e) => {
                                                           if (e.target.checked) {
                                                               setSelectedIds((prev) => [...checklists.map((checklist) => checklist.id)]);
                                                           } else {
                                                               setSelectedIds((prev) => []);
                                                           }
                                                       }}
                                                />
                                                <label className="form-check-label" htmlFor="item_all"/>
                                            </div>
                                        </td>
                                        <th class="border-bottom">Název</th>
                                        <th class="border-bottom">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {checklists.map((checklist, checklist_key) => (
                                        <tr key={checklist_key}>
                                            <td className="p-0 ps-2">
                                                <div className="form-check dashboard-check">
                                                    <input className="form-check-input" type="checkbox"
                                                           id={"item_" + checklist.id}
                                                           checked={selectedIds.includes(checklist.id)}
                                                           onClick={(e) => {
                                                               if (e.target.checked) {
                                                                   setSelectedIds((prev) => [...prev, checklist.id]);
                                                               } else {
                                                                   setSelectedIds((prev) => prev.filter((id) => id != checklist.id));
                                                               }
                                                           }}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor={"item_" + checklist.id}/>
                                                </div>
                                            </td>
                                            <td className="fw-bold  text-wrap">
                                                <a onClick={() => {
                                                    setModalChecklistId(checklist.id);
                                                    setModalIsOpen(true)
                                                }}
                                                   className="text-primary fw-bold">
                                                    {checklist.name}
                                                </a>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(checklist.id)}
                                                    className="btn btn-sm btn-link" type="button">
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
            ) : (
                <p>Zatím žádný checklist</p>
            )}

            {modalIsOpen && (
                <ChecklistFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={modalChecklistId}
                    projectId={projectId}
                    taskId={taskId}
                    callback={() => setReload(true)}/>
            )}


            {cloneModalIsOpen && (
                <ChecklistCloneModal
                    isOpen={cloneModalIsOpen}
                    onRequestClose={closeCloneModal}
                    setModalIsOpen={setCloneModalIsOpen}
                    projectId={projectId}
                    taskId={taskId}
                    callback={() => setReload(true)}/>
            )}
        </>
    );
};

export default ChecklistsList;