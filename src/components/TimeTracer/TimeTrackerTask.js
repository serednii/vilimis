import React, { useEffect } from 'react';
import Select from 'react-select';
import './tracker.sass';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const TimeTrackerTask = ({ option, handleSelected, selectedOption, loadTasks, isLoading, setOption, setIsLoading }) => {

    useEffect(() => {
        // loadTasks();
        const timeout = setTimeout(() => {
            setOption(options)
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timeout)
    }, []);

    return (
        <div className='tracker__select-wrapper position-absolute '>
            <Select isLoading={isLoading} className={'tracker__select'} value={selectedOption} onChange={(obj) => handleSelected(obj)} options={option} />
        </div>
    )
}

export default TimeTrackerTask;