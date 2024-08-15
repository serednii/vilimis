import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import {TIMETRACKER_ACTIONS} from "../../reducers/timetrackerReducer";
import TasksSelectList from "../Tasks/TasksSelectList";
import TimeTrackerFormModal from "./TimeTrackerFormModal";

const TimeTrackerItemView = ({taskTimetrack, onChange}) => {

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const date = new Date(taskTimetrack?.datetimeStart?.date.substring(0, 10)).toLocaleDateString();
    const timeStart = taskTimetrack.datetimeStart.date.substring(11, 16);
    const timeStop = taskTimetrack.datetimeStop.date.substring(11, 16);

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <span className="cursor-pointer" rel="presentation" onClick={()=>{
                setIsOpen(true);
            }}>
            <strong>{date}</strong> {timeStart} - {timeStop}
            </span>
            {modalIsOpen && (
                <TimeTrackerFormModal
                    isOpen={modalIsOpen}
                    setIsOpen={setIsOpen}
                    onRequestClose={closeModal}
                    taskTimetrack={taskTimetrack}
                    callback={onChange}/>
            )}
        </>
);

};

export default TimeTrackerItemView;