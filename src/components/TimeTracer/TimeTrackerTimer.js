import { useEffect } from "react";

const TimeTrackerTimer = ({ timeTrackerStart, timeTrackerStop, elapsedTime }) => {


    useEffect(() => {
        timeTrackerStart()
        return () => timeTrackerStop()
    }, []);

    return (
        <div className='d-flex  align-items-center '>
            <div className='tracker__timer text-center bg-success p-2 text-white rounded-2 '>{elapsedTime}</div>
        </div>
    )
}

export default TimeTrackerTimer;