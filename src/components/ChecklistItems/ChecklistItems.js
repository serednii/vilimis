import ChecklistItemsItem from "./ChecklistItemsItem";
import React, {useEffect, useRef, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import ChecklistItemFormModal from "./ChecklistItemFormModal";
import update from "immutability-helper";
import ChecklistItemsItemBlank from "./ChecklistItemsItemBlank";

const ChecklistItems = ({checklistId, checklistGroupId, checklistItems, onChange, moveCardItem}) => {
    const {API} = useRootContext()

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalChecklistItemId, setModalChecklistItemId] = React.useState(0);

    function closeModal() {
        setModalIsOpen(false);
    }


    function handleDelete(id, noreload) {
        API.getData("/checklistItems/delete/" + id, () => {
            if (!noreload) {
                onChange();
            }
        });
    }

    return (
        <>
            {checklistItems?.length > 0 ? (
                checklistItems?.map((checklistItem, index) => (
                    <ChecklistItemsItem
                        key={checklistItem.id+"_"+index+"_"+checklistItem.name}
                        id={checklistItem.id}
                        index={index}
                        checklistItem={checklistItem}
                        moveCardItem={moveCardItem}
                        onChange={onChange}
                    />
                ))
            ) : (
               <ChecklistItemsItemBlank
                   moveCardItem={moveCardItem} id="0" index="-1" checklistGroupId={checklistGroupId}
               />
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
                    callback={onChange}/>
            )}
        </>
    );
};

export default ChecklistItems;