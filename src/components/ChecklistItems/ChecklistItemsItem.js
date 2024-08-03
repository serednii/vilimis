import React, {useState} from "react";
import ChecklistItemFormModal from "./ChecklistItemFormModal";
import {NotePencil} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";

const ChecklistItemsItem = ({checklistItem, checklistItems, onChange}) => {
    const {API} = useRootContext();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [checklistItemClone, setChecklistItemClone] = useState(checklistItem);

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleChangeDone(done) {
        const formData = new FormData();

        formData.append("id", checklistItemClone.id);
        formData.append("done", done?1:0);

        API.postData("/checklistItemDone/save", formData, (data) => {
            setChecklistItemClone(data.checklistItem);
        });
    }

    return (
        <>
            <div className={"checklist-item "+ (checklistItemClone.done?"is-done":"")}>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={checklistItemClone.done}
                           onChange={(e)=>handleChangeDone(e.target.checked)}
                           id={"checklistItem-" + checklistItemClone.id}/>
                    <label className="form-check-label"
                           htmlFor={"checklistItem-" + checklistItemClone.id}>
                        {checklistItemClone.name}


                        <button className="btn btn-xs btn-link" onClick={() => {
                            setModalIsOpen(true)
                        }}>
                            <NotePencil size={12}/>
                        </button>
                    </label>
                </div>
                <div dangerouslySetInnerHTML={{__html: checklistItemClone.description}}/>

                {modalIsOpen && (
                    <ChecklistItemFormModal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        setModalIsOpen={setModalIsOpen}
                        id={checklistItemClone.id}
                        checklistId={checklistItemClone.checklistId}
                        checklistGroupId={checklistItemClone.checklistGroupId}
                        callback={(checklistItem)=>setChecklistItemClone(checklistItem)}/>
                )}
            </div>
        </>
    );
};

export default ChecklistItemsItem;