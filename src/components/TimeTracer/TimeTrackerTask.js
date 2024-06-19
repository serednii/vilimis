import React from 'react';
import Select from 'react-select';
import TasksSelectList from "../Tasks/TasksSelectList";

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]

const TimeTrackerTask = ({ isOpen, handleChange, onNew }) => {
    return (
        isOpen && <div className='position-absolute' style={{zIndex:1040,right:0,width:"300px"}}>
            <TasksSelectList onChange={handleChange} onNew={onNew}/>
        </div>
    )
}

export default TimeTrackerTask;