import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import TaskFormModal from "../Tasks/TaskFormModal";
import TasksListItem from "../Tasks/TasksListItem";
import {TIMETRACKER_ACTIONS} from "../../reducers/timetrackerReducer";

const TimeTrackerItem = ({taskTimetrack, onChange}) => {
    const {API} = useRootContext();

    const [date, setDate] = useState(taskTimetrack.datetimeStart.date.substring(0, 10));
    const [timeStart, setTimeStart] = useState(taskTimetrack.datetimeStart.date.substring(11, 16));
    const [timeStop, setTimeStop] = useState(taskTimetrack.datetimeStop.date.substring(11, 16));
    const [canSave, setCanSave] = useState(false);
    const [firstRun, setFirstRun] = useState(true);

    useEffect(() => {
        if (firstRun) {
            setFirstRun(false);
            return;
        }
        setCanSave(true);
    }, [date, timeStart, timeStop]);

    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData;

        let datetimeStart = date + " " + timeStart;
        let datetimeStop = date + " " + timeStop;
        if (timeStart > timeStop) {
            let dateAfter = (new Date());
            dateAfter.setTime((new Date(date)).getTime() + 24*60*60*1000);
            datetimeStop = dateAfter.toISOString().substring(0, 10) + " " + timeStop;
        }

        formData.append("id", taskTimetrack.id);
        formData.append("task_id", taskTimetrack.taskId);
        formData.append("datetime_start", datetimeStart);
        formData.append("datetime_stop", datetimeStop);
        API.postData("/taskTimetrack/save", formData, ()=>{

            setCanSave(false);
            if (onChange) {
                onChange();
            }
        });
    }
    function handleDelete(id) {
        API.getData("/taskTimetrack/delete/"+id, ()=>{
            setCanSave(false);
            if (onChange) {
                onChange();
            }
        });
    }

    return (
        <form onSubmit={handleSave}>
            <div className="mb-3">
            <input type="date"  className="form-control"
                   onChange={(e)=>setDate(e.target.value)}
                   defaultValue={date}/>
            </div>

            <div className="row">
                <div className="col-6">
                    <input type="time" className="form-control"
                           onChange={(e)=>setTimeStart(e.target.value)}
                           defaultValue={timeStart}/>
                </div>
                <div className="col-6">
                    <input type="time" className="form-control"
                           onChange={(e)=>setTimeStop(e.target.value)}
                           defaultValue={timeStop}/>
                </div>
            </div>
            {canSave && (
                <div className="mt-3">
                    <button className="btn btn-sm btn-primary" type="submit">Uložit</button>
                    <button
                        onClick={() => window.confirm("Opravdu smazat?") && handleDelete(taskTimetrack.id)}
                        className="btn btn-sm btn-danger ms-2" type="button">Smazat
                    </button>
                </div>
            )}
        </form>
    );

};

export default TimeTrackerItem;