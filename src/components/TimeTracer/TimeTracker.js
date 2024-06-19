import { useEffect, useState } from "react";
import TimeTrackerButton from "./TimeTrackerButton";
import TimeTrackerTask from "./TimeTrackerTask";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import {TIMETRACKER_ACTIONS} from "../../reducers/timetrackerReducer";

const TimeTracker = () => {
    const { API, timetrackerState, timetrackerDispatch } = useRootContext();
    const [taskId, setTaskId] = useState([]);
    const [isOpen, setIsOpen] = useState(false)

    function handleChange(taskId) {
        setIsOpen(false);
        setTaskId(taskId);
        startTimer(taskId);
    }

    function handleStop() {
        stopTimer();
    }

    function startTimer(taskId) {
        timetrackerDispatch({
            action: TIMETRACKER_ACTIONS.START,
            taskId
        });
    }

    function stopTimer() {
        var formData = new FormData;

        var dateStart =  new Date();
        dateStart.setTime(timetrackerState.start);

        formData.append("task_id", timetrackerState.taskId);
        formData.append("datetime_start", dateStart.toISOString());
        formData.append("datetime_stop",  (new Date()).toISOString());
        API.postData("/taskTimetrack/save", formData, (data) => {
            timetrackerDispatch({
                action: TIMETRACKER_ACTIONS.STOP
            });
        });
    }

    return (
        <div className="h-100 position-relative">
            <TimeTrackerButton timetrackerState={timetrackerState} isOpen={isOpen} setIsOpen={setIsOpen} taskId={taskId} handleStop={handleStop} />
            <TimeTrackerTask isOpen={isOpen} handleChange={handleChange} />
        </div>
    )



}

export default TimeTracker;



