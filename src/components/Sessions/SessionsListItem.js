import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import SessionFormModal from "./SessionFormModal";

const SessionsListItem = ({session, handleUpdate, clients}) => {
    const {API, locale} = useRootContext()

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div role="presentation" onClick={() => {
                setIsOpen(true)
            }} className="row align-items-center d-block d-sm-flex border-bottom pb-4 mb-4 cursor-pointer">
                <div className="col-auto mb-3 mb-sm-0">
                    {session && "datetimeOfSession" in session && session.datetimeOfSession && "date" in session.datetimeOfSession && (
                        <>
                    <div className="calendar d-flex"><span className="calendar-month">{locale._months[(new Date(session.datetimeOfSession.date)).getMonth()]}</span><span
                        className="calendar-day py-2">{(new Date(session.datetimeOfSession.date)).getDate()}</span></div>
                        </>
                    )}
                </div>
                <div className="col"><h3 className="h6 mb-1">{session.name}</h3>

                        {session && "datetimeOfSession" in session && session.datetimeOfSession && "date" in session.datetimeOfSession && (
                                <div className="small fw-bold">
                                    {(new Date(session.datetimeOfSession.date)).toLocaleDateString()}
                                </div>
                            )}

                    <p>
                        {session.description.substring(0, 50)}...
                    </p>
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