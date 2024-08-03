import ChecklistItemsItem from "./ChecklistItemsItem";
import React, {useEffect, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import ChecklistItemFormModal from "./ChecklistItemFormModal";

const ChecklistItems = ({checklistId, checklistGroupId}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true);
    const [checklistItems, setChecklistItems] = useState([]);

    const [checklistsItemsLoading, setChecklistsItemsLoading] = useState(false);


    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalChecklistItemId, setModalChecklistItemId] = React.useState(0);

    function closeModal() {
        setModalIsOpen(false);
    }


    function handleDelete(id, noreload) {
        API.getData("/checklistItems/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    useEffect(() => {
        if (!reload) return;

        setChecklistsItemsLoading(true);
        setChecklistsItemsLoading(true);

        let url = "/checklistItem/list";
        url += "?"
        url += "&filter[checklist_id]=" + encodeURIComponent(checklistId);
        url += "&filter[checklist_group_id]=" + encodeURIComponent(checklistGroupId);
        url += "&order=priority";

        API.getData(url, (checklistItems) => {
            setChecklistItems(checklistItems);
            setChecklistsItemsLoading(false);
        });

        setReload(false);
    }, [checklistId, reload]);

    return (
        <>

            {checklistsItemsLoading ? (
                <>Načítaní..</>
            ) : (
                checklistItems?.length > 0 ? (
                    checklistItems?.map((checklistItem) => (
                        <ChecklistItemsItem
                            key={checklistItem.id}
                            checklistItem={checklistItem}
                            checklistItems={checklistItems}
                            onChange={() => setReload(true)}
                        />
                    ))
                ) : (
                    <p>Zatím žádné položky</p>
                )
            )}


            <div className="my-3">
                <button onClick={() => {
                    setModalIsOpen(true);
                    setModalChecklistItemId(null);
                }}
                        className="btn btn-lint btn-xs d-inline-flex align-items-center me-2">
                    <Plus size={16} className="me-2"/>
                </button>
            </div>

            {modalIsOpen && (
                <ChecklistItemFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={modalChecklistItemId}
                    checklistId={checklistId}
                    checklistGroupId={checklistGroupId}
                    callback={() => setReload(true)}/>
            )}
        </>
    );
};

export default ChecklistItems;