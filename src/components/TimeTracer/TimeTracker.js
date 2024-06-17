import { useEffect, useState } from "react";
import TimeTrackerButton from "./TimeTrackerButton";
import TimeTrackerTask from "./TimeTrackerTask";
import { useRootContext } from "../../contexts/RootContext";
import { CONFIG } from "../../config";

const TimeTracker = () => {
    const { API } = useRootContext();
    const [option, setOption] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadTasks();
    }, []);

    console.log(option)

    function loadTasks() {
        API.getData("/task/list", (tasks) => {
            setTasks(tasks);

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
            }
        });
    }

    return (
        <div className="h-100 position-relative">
            <TimeTrackerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            <TimeTrackerTask option={option} isOpen={isOpen} />
        </div>
    )



}

export default TimeTracker;



