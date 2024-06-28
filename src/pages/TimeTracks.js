import {useRootContext} from "../contexts/RootContext";
import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";
import ProjectDatesListDashboard from "../components/Dashboard/ProjectDatesListDashboard";
import React, {useEffect, useState} from "react";
import TimeTrackerFormModal from "../components/TimeTracer/TimeTrackerFormModal";

const TimeTracks = ({}) => {
    const {API, locale} = useRootContext()

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [reload, setReload] = useState(true);
    const [taskTimetracks, setTaskTimetracks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    function closeModal() {
        setIsOpen(false);
    }


    useEffect(() => {
        if (!reload) return;
        document.title = "Časové záznamy";

        API.getData("/taskTimetrack/list?order=datetime_start", (taskTimetracks) => {
            setTaskTimetracks(taskTimetracks);
        });

        API.getData("/task/list", (tasks) => {
            setTasks(tasks);
        });


        API.getData("/project/list", (projects) => {
            setProjects(projects);
        });

        setReload(false);
    }, [reload]);


    const date = new Date();
    const day = date.getDay();
    const date_monday = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(date_monday));
    const days = [...Array(7).keys()];
    const hours = [...Array(24).keys()];
    let tmpDate = monday;

    const hoursFrom = 8;
    const hoursTo = 21;

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Časové záznamy</h1></div>
            </div>

            <h2 className="h5 mb-3 text-center">{locale._months_fullname[monday.getMonth()]} {monday.getFullYear()}</h2>

            <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0 rounded table-bordered">
                    <thead>
                    <th></th>
                    {days.map(day => (
                        <th className="text-center position-relative" key={"day" + + day}>
                            {(tmpDate = new Date(date.setDate(date_monday + day))) && ""}
                            {tmpDate.getDate()}.

                            {taskTimetracks?.filter(taskTimetrack => (
                                (new Date(taskTimetrack.datetimeStart.date)).setHours(0, 0, 0, 0)
                                ===
                                tmpDate.setHours(0,0,0,0)
                            )).map(taskTimetrack => (
                                <React.Fragment key={taskTimetrack.id}>
                                <div rel="presentation" onClick={()=>setIsOpen(taskTimetrack.id)} className="shadow timetrack-table__item" style={{
                                    borderRadius: ".5rem",
                                    background: "#fff",
                                    whiteSpace: "normal",
                                    left: "0px",
                                    width: "100%",
                                    minHeight: ((new Date(taskTimetrack.datetimeStop.date).getTime() - (new Date(taskTimetrack.datetimeStart.date).getTime())) / 1000 / 60) + "px",
                                    maxHeight: ((new Date(taskTimetrack.datetimeStop.date).getTime() - (new Date(taskTimetrack.datetimeStart.date).getTime())) / 1000 / 60) + "px",
                                    overflow: "hidden",
                                    position: "absolute",
                                    top:  "calc(100% + "+(((new Date(taskTimetrack.datetimeStart.date)).getHours()*60) + (new Date(taskTimetrack.datetimeStart.date).getMinutes()) - hoursFrom*60) + "px)"
                                }}>
                                    <div className="timetrack-table__item__content">
                                    {tasks.filter(task=>task.id===taskTimetrack.taskId).map(task=>(
                                        <div key={task.id}>
                                            <strong>{task.name}</strong>
                                            {projects.filter(project=>project.id===task.projectId).map(project=>(
                                                <div key={project.id}>
                                                    {project.name}
                                                </div>
                                            ))}

                                        </div>
                                    ))}
                                    </div>
                                </div>
                                    {modalIsOpen && modalIsOpen===taskTimetrack.id && (
                                        <TimeTrackerFormModal
                                            isOpen={modalIsOpen}
                                            setIsOpen={setIsOpen}
                                            onRequestClose={closeModal}
                                            taskTimetrack={taskTimetrack}
                                            callback={setReload}/>
                                    )}
                                </React.Fragment>
                            ))}
                        </th>
                    ))}
                    </thead>
                    <tbody>
                    {hours.map(hour => (
                        (hour >= hoursFrom && hour <= hoursTo) && (
                        <tr key={"hour" + hour}>
                            <td style={{height: "60px",width:"4rem"}} className="border-0 align-middle">
                                <strong>{hour}:00</strong>
                            </td>
                            {days.map(day => (
                                <td key={"day" + hour + "-" + day}>

                                </td>
                            ))}
                        </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TimeTracks;