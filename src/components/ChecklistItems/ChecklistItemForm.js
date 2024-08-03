import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import JoditEditor from 'jodit-react';
import {CONFIG} from "../../config";

const ChecklistItemForm = ({id, handleSave, checklistId, checklistGroupId}) => {
    const {API} = useRootContext()
    const [checklistItem, setChecklistItem] = useState(null);

    const [checklistItemLoading, setChecklistItemLoading] = useState(false);

    const editor = useRef(null);
    const [content, setContent] = useState('');


    const checklistItemBlank = {
        name: "",
        description: "",
        checklistId,
        checklistGroupId
    }

    useEffect(() => {
        if (id) {
            setChecklistItemLoading(true);

            API.getData("/checklistItem/single/" + id, (checklistItem) => {
                setContent(checklistItem.description);
                setChecklistItem(checklistItem);
                setChecklistItemLoading(false);
            });
        } else {
            setContent("");
            setChecklistItem(checklistItemBlank);
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/checklistItem/save", formData, (data) => {
            setChecklistItem(data.checklistItem);

            if (handleSave) {
                handleSave(data.checklistItem);
            }
        });
    }

    if (checklistItemLoading) {
        return (<>Načítaní..</>)
    }


    return (
        <>
            {checklistItem && "name" in checklistItem && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="done" value={checklistItem.done?1:0}/>
                    <input type="hidden" name="priority" value={checklistItem.priority}/>
                    <input type="hidden" name="checklist_id" value={checklistItem.checklistId}/>
                    <input type="hidden" name="checklist_group_id" value={checklistItem.checklistGroupId}/>

                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={checklistItem.name} type="text" name="name"
                               className="form-control form-control-lg"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_description">Popis</label>

                        <input type="hidden" name="description" value={content}/>

                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={CONFIG.joedit}
                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => {
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default ChecklistItemForm;