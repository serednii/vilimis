import React, { useEffect } from 'react';
import Select from 'react-select';
import TasksSelectList from "../Tasks/TasksSelectList";


const TimeTrackerTask = ({ isOpen, handleChange, onNew }) => {
    return (
        isOpen && <div className='timetracker-button_list '>
            <TasksSelectList onChange={handleChange} onNew={onNew}/>
        </div>
    )
}

export default TimeTrackerTask;