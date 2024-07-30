import { useRef, useState } from "react";
import TimeTrackerButton from "./TimeTrackerButton";
import TimeTrackerTask from "./TimeTrackerTask";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import {TIMETRACKER_ACTIONS} from "../../reducers/timetrackerReducer";

const TimeTracker = ({taskId}) => {
    const { API, timetrackerState, timetrackerDispatch } = useRootContext();
    const [isOpen, setIsOpen] = useState(false)

    function handleChange(taskId) {
        setIsOpen(false);
        handleStart(taskId);
    }

    function handleStart(selectedTaskId) {
        if (selectedTaskId) {
            startTimer(selectedTaskId);
            return;
        }

        if (taskId) {
            startTimer(taskId);
        }
    }

    function handleStop() {
        stopTimer();
    }

    function startTimer(selectedTaskId) {
        let originalTaskId = timetrackerState.taskId;
        if (timetrackerState.start !== null) {
            stopTimer(()=>{
                if ((originalTaskId && selectedTaskId != originalTaskId) || !originalTaskId) {
                    timetrackerDispatch({
                        action: TIMETRACKER_ACTIONS.START,
                        taskId: selectedTaskId
                    });
                }
            });
            return;
        }

        if ((selectedTaskId && selectedTaskId != selectedTaskId) || !originalTaskId) {
            timetrackerDispatch({
                action: TIMETRACKER_ACTIONS.START,
                taskId: selectedTaskId
            });
        }
    }

    function stopTimer(afterStop) {
        var formData = new FormData;

        var dateStart =  new Date();
        var dateStop =  new Date();
        dateStart.setTime(timetrackerState.start);
        dateStop.setTime((new Date()).getTime() - ((new Date()).getTimezoneOffset() * 60000))

        formData.append("task_id", timetrackerState.taskId);
        formData.append("datetime_start", dateStart.toISOString());
        formData.append("datetime_stop",  dateStop.toISOString());
        API.postData("/taskTimetrack/save", formData, (data) => {
            timetrackerDispatch({
                action: TIMETRACKER_ACTIONS.STOP
            });

            if (afterStop) {
                afterStop();
            }
        });
    }

    return (
        <div className="h-100  timetracker-button_wrap">
            <TimeTrackerButton timetrackerState={timetrackerState} isOpen={isOpen} setIsOpen={setIsOpen} single={taskId?true:false}
                               isActive={(taskId && taskId == timetrackerState.taskId) ? true: false} taskId={timetrackerState.taskId} handleStart={handleStart} handleStop={handleStop} />
            <TimeTrackerTask isOpen={isOpen} handleChange={handleChange} />
        </div>
    )

}

export default TimeTracker;



