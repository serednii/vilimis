import {faClock, faStop} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";

const TimeTrackerButton = ({ isOpen, setIsOpen, timetrackerState, tasks, handleStop }) => {
    const [timeSpentOnPage, setTimeSpentOnPage] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timetrackerState.start) {
                setTimeSpentOnPage((new Date()).getTime() - timetrackerState.start); // increment by 1 second
            } else {
                setTimeSpentOnPage(0);
            }
        }, 1000); // every 1 second
        return () => clearInterval(intervalId); // cleanup
    }, [timetrackerState]); // run only once on mount

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    const seconds = Math.round(timeSpentOnPage / 1000);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    if (s<10) {
        s = "0" + s;
    }

    if (m < 10) {
        m = "0" + m;
    }

    return (
        <div className="h-100 d-flex justify-content-sm-center align-items-center">
            {timetrackerState.start === null ? (
                <button className="text-default fw-bold   border-0" onClick={handleClick}>
                    <FontAwesomeIcon icon={faClock}/>
                </button>
            ) : (
                <span>
                    {timeSpentOnPage === 0 ? ("....") : (
                        <>
                            {tasks && tasks.length > 0 && tasks.filter(task => task.id === timetrackerState.taskId).map((task, task_index) => (
                                <span key={task_index}>
                                    {task.name.length > 32 ? (
                                        <>
                                            {task.name.substring(0, 32)}...
                                        </>
                                    ) : task.name}
                                </span>
                            ))}: &nbsp;
                            {h>0&&(
                                <>
                                    {h}:
                                </>
                            )}
                            {m}:{s}
                        </>
                    )}
                    <button className="ms-2 text-default fw-bold   border-0" onClick={handleStop}>
                        <FontAwesomeIcon icon={faStop}/> Zastavit
                    </button>
                </span>
            )}
        </div>
    )

}

export default TimeTrackerButton;