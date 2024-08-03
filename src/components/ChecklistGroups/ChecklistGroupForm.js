import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import JoditEditor from 'jodit-react';
import {CONFIG} from "../../config";

const ChecklistGroupForm = ({id, handleSave, checklistId}) => {
    const {API} = useRootContext()
    const [checklistGroup, setChecklistGroup] = useState(null);

    const [checklistGroupLoading, setChecklistGroupLoading] = useState(false);

    const editor = useRef(null);
    const [content, setContent] = useState('');


    const checklistGroupBlank = {
        name: "",
        description: "",
        checklistId
    }

    useEffect(() => {
        if (id) {
            setChecklistGroupLoading(true);

            API.getData("/checklistGroup/single/" + id, (checklistGroup) => {
                setContent(checklistGroup.description);
                setChecklistGroup(checklistGroup);
                setChecklistGroupLoading(false);
            });
        } else {
            setContent("");
            setChecklistGroup(checklistGroupBlank);
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/checklistGroup/save", formData, (data) => {
            setChecklistGroup(data.checklistGroup);

            if (handleSave) {
                handleSave(data.checklistGroup);
            }
        });
    }

    if (checklistGroupLoading) {
        return (<>Načítaní..</>)
    }


    return (
        <>
            {checklistGroup && "name" in checklistGroup && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="done" value={checklistGroup.done ? 1 : 0}/>
                    <input type="hidden" name="priority" value={checklistGroup.priority}/>
                    <input type="hidden" name="checklist_id" value={checklistGroup.checklistId}/>

                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={checklistGroup.name} type="text" name="name"
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

export default ChecklistGroupForm;