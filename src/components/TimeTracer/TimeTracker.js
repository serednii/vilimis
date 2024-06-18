import { useEffect, useState } from "react";
import TimeTrackerButton from "./TimeTrackerButton";
import TimeTrackerTask from "./TimeTrackerTask";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import {TIMETRACKER_ACTIONS} from "../../reducers/timetrackerReducer";

const TimeTracker = () => {
    const { API, timetrackerState, timetrackerDispatch } = useRootContext();
    const [option, setOption] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return;

        loadTasks();
    }, [isOpen]);

    useEffect(() => {
        loadTasks();
    }, []);

    function loadTasks() {
        API.getData("/task/list", (tasks) => {
            setTasks(tasks);

            if (tasks && tasks.length > 0) {
                const options = [];
                tasks.map(task => {
                    let taskValue = {
                        value: task.id,
                        label: (<span>{task.name}</span>),
                        logo: task.logo ? CONFIG.uploadDir + task.logo : ""
                    };
                    options.push(taskValue);
                });
                setOption(options);
            }
        });
    }

    function handleChange(task) {
        const taskId = task.value;
        setIsOpen(false);
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
            <TimeTrackerButton timetrackerState={timetrackerState} isOpen={isOpen} setIsOpen={setIsOpen} tasks={tasks} handleStop={handleStop} />
            <TimeTrackerTask option={option} isOpen={isOpen} handleChange={handleChange} />
        </div>
    )



}

export default TimeTracker;



