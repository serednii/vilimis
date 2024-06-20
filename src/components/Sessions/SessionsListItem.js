import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import SessionFormModal from "./SessionFormModal";

const SessionsListItem = ({session, onUpdate, projects, clients}) => {
    const {API, locale} = useRootContext()

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleDelete(id) {
        API.getData("/session/delete/"+id, ()=>{
            handleUpdate();
        });
    }

    function handleUpdate()
    {
        if (onUpdate) {
            onUpdate();
        }
    }

    let project = null;
    const projectsFinded = projects.filter((project)=>project.id == session.projectId)
    if (projectsFinded.length > 0) {
        project = projectsFinded[0];
    }

    return (
        <>
            <div role="presentation" onClick={() => {
                setIsOpen(true)
            }} className="row align-items-center d-block d-sm-flex border-bottom pb-4 mb-4">
                <div className="col-auto mb-3 mb-sm-0">
                    <div className="calendar d-flex"><span className="calendar-month">{locale._months[(new Date(session.date.date)).getMonth()]}</span><span
                        className="calendar-day py-2">{(new Date(session.date.date)).getDate()}</span></div>
                </div>
                <div className="col"><h3 className="h6 mb-1">{session.name}</h3>

                    {project != null && (
                        <span>
                            {project.name}
                        </span>
                    )}
                        {session && "date" in session && session.date && "date" in session.date && (
                                <div className="small fw-bold">
                                    {(new Date(session.date.date)).toLocaleDateString()}
                                </div>
                            )}
                </div>
            </div>

            {modalIsOpen && (
                <SessionFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={handleUpdate}
                    projectId={session.projectId}
                    id={session.id}/>
            )}
        </>
    );
};

export default SessionsListItem;