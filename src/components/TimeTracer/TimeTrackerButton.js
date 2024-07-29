import {faClock, faStop} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {ClockCountdown, Stop, StopCircle, Timer} from "@phosphor-icons/react";
import {parseTime} from "../../utils";

const TimeTrackerButton = ({isOpen, setIsOpen, isActive, timetrackerState, tasks, handleStart, handleStop, taskId, single}) => {
    const {API} = useRootContext();
    const [timeSpentOnPage, setTimeSpentOnPage] = useState(0);
    const [task, setTask] = useState(null)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (timetrackerState.start) {
                setTimeSpentOnPage((new Date()).getTime() - ((new Date()).getTimezoneOffset() * 60000) - timetrackerState.start); // increment by 1 second
            } else {
                setTimeSpentOnPage(0);
            }
        }, 1000); // every 1 second
        return () => clearInterval(intervalId); // cleanup
    }, [timetrackerState]); // run only once on mount

    useEffect(() => {
        if (taskId && taskId > 0) {
            API.getData("/task/single/" + taskId, (task) => {
                setTask(task);
            });
        }
    }, [taskId]);

    const handleClick = () => {
        if (!single) {
            setIsOpen(!isOpen)
        } else if (handleStart) {
            handleStart();
        }
    }

    // const seconds = Math.round(timeSpentOnPage / 1000);
    // var d = Math.floor(seconds / (3600 * 24));
    // var h = Math.floor(seconds % (3600 * 24) / 3600);
    // var m = Math.floor(seconds % 3600 / 60);
    // var s = Math.floor(seconds % 60);

    let {h, m, s} = parseTime(timeSpentOnPage)

    if (s < 10) {
        s = "0" + s;
    }

    if (m < 10) {
        m = "0" + m;
    }

    return (
        <div className="h-100 d-flex justify-content-sm-center align-items-center">
            {(timetrackerState.start === null || single) ? (
                <button className={"btn btn-xs btn-text text-default fw-bold border-0 "+(isActive?"text-success":"")} onClick={handleClick}>
                    <Timer size={20}/>
                </button>
            ) : (
                <span>
                    {timeSpentOnPage === 0 ? ("....") : (
                        <>
                            {task && "name" in task && (
                                <span>
                                    {task.name.length > 32 ? (
                                        <>
                                            {task.name.substring(0, 32)}...
                                        </>
                                    ) : task.name}
                                </span>
                            )}: &nbsp;
                            {h > 0 && (
                                <>
                                    {h}:
                                </>
                            )}
                            {m}:{s}
                        </>
                    )}
                    <button className="ms-2 text-default fw-bold   border-0" onClick={handleStop}>
                        <Stop size={20}/>
                    </button>
                </span>
            )}
        </div>
    )

}

export default TimeTrackerButton;