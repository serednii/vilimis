import { useEffect, useRef, useState } from "react";
import TimeTrackerButton from "./TimeTrackerButton";
import TimeTrackerTask from "./TimeTrackerTask";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";
import TimeTrackerTimer from "./TimeTrackerTimer";
import TimeTrackerButtonStop from "./TimeTrackerButtonStop";
import TimeTrackerButtonStart from './TimeTrackerButtonStart';

const TimeTracker = () => {
    const { API } = useRootContext();
    const [option, setOption] = useState([]);
    const [isShowSelect, setIsShowSelect] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);// вибрані дані в селекті
    const [isLoading, setIsLoading] = useState(true);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const timerId = useRef(null);
    const startTime = useRef(null);

    const handleSelected = (obj) => {
        setSelectedOption(obj);
        setIsShowSelect(false);
        setIsShowTimer(true);
    }

    const timeTrackerStart = () => {
        console.log(timerId.current)
        if (timerId.current) return;
        const realTime = new Date().getTime()

        !startTime.current ? startTime.current = realTime : startTime.current = realTime - startTime.current
        timerId.current = setInterval(() => {
            const now = new Date().getTime();
            const diff = now - startTime.current;
            const diffTime = new Date(diff);
            const hours = Math.floor(diffTime.getHours() - 1).toString().padStart(2, '0');
            const minutes = Math.floor(diffTime.getMinutes()).toString().padStart(2, '0');
            const seconds = Math.floor(diffTime.getSeconds()).toString().padStart(2, '0');
            setElapsedTime(prevElapsedTime => `${hours}:${minutes}:${seconds}`);
        }, 1000);
    }
    console.log(option)
    const timeTrackerStop = () => {
        if (!timerId.current) return
        clearInterval(timerId.current);
        timerId.current = null
        const realTime = new Date().getTime()
        startTime.current = realTime - startTime.current
    }


    function loadTasks() {
        API.getData("/task/list", (tasks) => {

            if (tasks && tasks.length > 0) {
                const options = [];
                tasks.map(task => {
                    let taskValue = {
                        value: task.id,
                        label: task.name,
                        logo: task.logo ? CONFIG.uploadDir + task.logo : ""
                    };
                    options.push(taskValue);
                });
                setOption(options);
                setIsLoading(false);
            }
        });
    }

    return (
        <div className="h-100 position-relative d-flex align-items-center gap-3 ms-auto me-3">
            {!isShowTimer && <TimeTrackerButton isShowSelect={isShowSelect} setIsShowSelect={setIsShowSelect} Select />}
            {isShowSelect && <TimeTrackerTask loadTasks={loadTasks} setIsLoading={setIsLoading} setOption={setOption} isLoading={isLoading} selectedOption={selectedOption} handleSelected={handleSelected} option={option} />}
            {isShowTimer && <TimeTrackerTimer timeTrackerStart={timeTrackerStart} timeTrackerStop={timeTrackerStop} elapsedTime={elapsedTime} />}
            {isShowTimer && <TimeTrackerButtonStop timeTrackerStop={timeTrackerStop} />}
            {isShowTimer && <TimeTrackerButtonStart timeTrackerStart={timeTrackerStart} />}

        </div>
    )

}

export default TimeTracker;



