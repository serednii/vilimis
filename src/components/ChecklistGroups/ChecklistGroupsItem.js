import React, {useState} from "react";
import ChecklistGroupFormModal from "./ChecklistGroupFormModal";
import {NotePencil} from "@phosphor-icons/react";
import ChecklistItems from "../ChecklistItems/ChecklistItems";

const ChecklistGroupsItem = ({checklistGroup, onChange}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <>
            <div className={"card  border-0 shadow mb-3"}>
                <div
                    className="card-header d-flex align-items-center justify-content-between border-0 ">

                    <h3 className="h5 mb-0">
                        <span>{checklistGroup.name}</span>
                    </h3>

                    <button className="btn btn-xs btn-link" onClick={() => {
                        setModalIsOpen(true)
                    }}>
                        <NotePencil size={20}/>
                    </button>
                </div>
                <div className="card-body">
                    <div className="card-body-content">
                        <div dangerouslySetInnerHTML={{ __html: checklistGroup.description }} />
                    </div>

                    <ChecklistItems
                        checklistId={checklistGroup.checklistId}
                        checklistGroupId={checklistGroup.id}
                    />
                </div>
            </div>

            {modalIsOpen && (
                <ChecklistGroupFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={checklistGroup.id}
                    checklistId={checklistGroup.checklistId}
                    callback={onChange}/>
            )}
        </>
    );
};

export default ChecklistGroupsItem;