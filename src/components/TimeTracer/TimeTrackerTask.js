import React from 'react';
import Select from 'react-select';

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]

const TimeTrackerTask = ({ option, isOpen }) => {
    return (
        isOpen && <div className='position-absolute'>
            <Select options={option} />
        </div>
    )
}

export default TimeTrackerTask;