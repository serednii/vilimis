import React from 'react';
import Select from 'react-select';

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]

const TimeTrackerTask = ({ option, isOpen, handleChange }) => {
    return (
        isOpen && <div className='position-absolute' style={{right:0,width:"300px"}}>
            <Select options={option} onChange={handleChange} />
        </div>
    )
}

export default TimeTrackerTask;