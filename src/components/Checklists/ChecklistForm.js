import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import JoditEditor from 'jodit-react';
import {CONFIG} from "../../config";
import ChecklistGroups from "../ChecklistGroups/ChecklistGroups";

const checklistBlank = {
    name: "",
    description: "",
}

const ChecklistForm = ({id, handleSave, taskId, projectId}) => {
    const {API} = useRootContext()
    const [checklist, setChecklist] = useState(null);


    const checklistBlank = {
        name: "",
        description: "",
        projectId: projectId,
        taskId: taskId
    }

    const [checklistLoading, setChecklistLoading] = useState(false);

    const editor = useRef(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            setChecklistLoading(true);

            API.getData("/checklist/single/" + id, (checklist) => {
                setContent(checklist.description);
                setChecklist(checklist);
                setChecklistLoading(false);
            });
        } else {
            setContent("");
            setChecklist(checklistBlank);
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/checklist/save", formData, (data) => {
            setChecklist(data.checklist);

            if (handleSave) {
                handleSave(data.checklist);
            }
        });
    }

    if (checklistLoading) {
        return (<>Načítaní..</>)
    }


    return (
        <>
            {id ? (
                checklist && "name" in checklist && (
                    <div className="row">
                        <div className="col-md-6">
                            <form onSubmit={handleSubmit}>
                                <input type="hidden" name="project_id" value={checklist.projectId}/>
                                <input type="hidden" name="task_id" value={checklist.taskId}/>

                                <div className="mb-3">
                                    <label htmlFor="form_edit_name">Název</label>
                                    <input defaultValue={checklist.name} type="text" name="name"
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
                        </div>
                        <div className="col-md-6">
                        <ChecklistGroups checklistId={id}/>
                        </div>
                    </div>
                )
            ) : (
                checklist && "name" in checklist && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="form_edit_name">Název</label>
                            <input defaultValue={checklist.name} type="text" name="name"
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
                )
            )}
        </>
    );
};

export default ChecklistForm;