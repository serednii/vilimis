import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import TimeTrackerItem from "../TimeTracer/TimeTrackerItem";

const TaskFormTimeTracks = ({taskId}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true);
    const [amountTime, setAmountTime] = useState(0);
    const [taskTimetracks, setTaskTimetracks] = useState([]);

    useEffect(() => {
        if (!reload) return;

        API.getData("/taskTimetrack/list", (taskTimetracks) => {
            setTaskTimetracks(taskTimetracks.filter(taskTimetrack => (
                taskTimetrack.taskId === taskId
            )));
        });

        setReload(false);
    }, [reload]);

    useEffect(() => {
        let amountTimeTmp = 0;
        taskTimetracks.forEach((taskTimetrack) => {
            let diff = (new Date(taskTimetrack.datetimeStop.date).getTime());
            diff -= (new Date(taskTimetrack.datetimeStart.date).getTime());

            amountTimeTmp += diff;
        })

        setAmountTime(amountTimeTmp);
    }, [taskTimetracks]);

    if (amountTime > 0) {
        const seconds = Math.round(amountTime / 1000);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);

        if (s < 10) {
            s = "0" + s;
        }

        if (m < 10) {
            m = "0" + m;
        }
    }

    return (
        <div>
            {amountTime > 0 && (
                <div className="mt-4">
                    Celkově strávený čas: <strong>{d > 0 && d + ":"}{h}:{m}</strong>
                </div>
            )}
            {taskTimetracks && taskTimetracks.length > 0 && taskTimetracks.map((taskTimetrack, taskTimetrack_index) => (
                <div key={taskTimetrack_index} className=" card p-3 mt-4">
                    <TimeTrackerItem taskTimetrack={taskTimetrack} onChange={()=>setReload(true)}/>
                </div>
            ))}
        </div>
    );

};

export default TaskFormTimeTracks;