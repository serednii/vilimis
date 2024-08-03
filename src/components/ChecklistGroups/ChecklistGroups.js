import ChecklistGroupsItem from "./ChecklistGroupsItem";
import React, {useEffect, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import ChecklistGroupFormModal from "./ChecklistGroupFormModal";

const ChecklistGroups = ({checklistId}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true);
    const [checklistGroups, setChecklistGroups] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);

    const [checklistsGroupsLoading, setChecklistsGroupsLoading] = useState(false);


    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalChecklistGroupId, setModalChecklistGroupId] = React.useState(0);

    function closeModal() {
        setModalIsOpen(false);
    }


    function handleDelete(id, noreload) {
        API.getData("/checklistGroups/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    useEffect(() => {
        if (!reload) return;

        setChecklistsGroupsLoading(true);

        let url = "/checklistGroup/list";
        url += "?"
        url += "&filter[checklist_id]=" + encodeURIComponent(checklistId);
        url += "&order=priority";

        API.getData(url, (checklistGroups) => {
            setChecklistGroups(checklistGroups);
            setChecklistsGroupsLoading(false);
        });

        setReload(false);
    }, [checklistId, reload]);

    return (
        <>

            {checklistsGroupsLoading ? (
                <>Načítaní..</>
            ) : (
                checklistGroups?.length > 0 ? (
                    checklistGroups?.map((checklistGroup) => (
                        <ChecklistGroupsItem
                            key={checklistGroup.id}
                            checklistGroup={checklistGroup}
                            onChange={() => setReload(true)}
                        />
                    ))
                ) : (
                    <p>Zatím žádné skupiny</p>
                )
            )}


            <div className="my-3">
                <button onClick={() => {
                    setModalIsOpen(true);
                    setModalChecklistGroupId(null);
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={16} className="me-2"/>
                    Nová skupina
                </button>
            </div>

            {modalIsOpen && (
                <ChecklistGroupFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={modalChecklistGroupId}
                    checklistId={checklistId}
                    callback={() => setReload(true)}/>
            )}
        </>
    );
};

export default ChecklistGroups;