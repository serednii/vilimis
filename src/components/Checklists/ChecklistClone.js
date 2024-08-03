import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

const ChecklistClone = ({handleSave, taskId, projectId}) => {
    const {API} = useRootContext()
    const [checklists, setChecklists] = useState([]);
    const [checklistsLoading, setChecklistsLoading] = useState(false);


    useEffect(() => {
        setChecklistsLoading(true);

        let url = "/checklist/list?order=name";

        API.getData(url, (checklists) => {
            setChecklists(checklists);
            setChecklistsLoading(false);
        });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (taskId) {
            formData.append("task_id", taskId);
        }

        if (projectId) {
            formData.append("project_id", projectId);
        }

        API.postData("/checklistClone/save", formData, () => {
            if (handleSave) {
                handleSave();
            }
        });
    }

    if (checklistsLoading) {
        return ("Načítání...");
    }

    return (
        <>
            {checklists && checklists?.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <select name="original_id"
                                className="form-control form-control-lg" required={true}>
                            {checklists.map((checklist)=>(
                                <option key={checklist.id} value={checklist.id}>{checklist.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Klonovat
                    </button>
                </form>
            ) : (
                <p>
                    Žádný checklist zatím není
                </p>
            )}
        </>
    );
};

export default ChecklistClone;