import {useRootContext} from "../contexts/RootContext";
import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";
import ProjectDatesListDashboard from "../components/Dashboard/ProjectDatesListDashboard";
import React, {useEffect, useState} from "react";
import BudgetCalculator from "../utils/BudgetCalculator";

const Reports = ({}) => {
    const {API, locale} = useRootContext()

    const [reload, setReload] = useState(true);
    const [taskTimetracks, setTaskTimetracks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);


    useEffect(() => {
        if (!reload) return;
        document.title = "Reporty";

        API.getData("/taskTimetrack/list?order=datetime_start", (taskTimetracks) => {
            setTaskTimetracks(taskTimetracks);
        });

        API.getData("/task/list?order=name", (tasks) => {
            setTasks(tasks);
        });

        API.getData("/project/list?order=name", (projects) => {
            setProjects(projects);
        });


        API.getData("/client/list?order=name", (clients) => {
            setClients(clients);
        });

        setReload(false);
    }, [reload]);


    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthWithZero = month < 10 ? "0" + month : month;
    const firstDate = new Date(year, month, 1).getDate();
    const firstDateWithZero = firstDate < 10 ? "0" + firstDate : firstDate;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const lastDateWithZero = lastDate < 10 ? "0" + lastDate : lastDate;

    let report = {clients: [], hours: 0, forInvoicing: 0, rows: 0};
    clients?.forEach(client => {
        let clientData = {
            client: client.name,
            projects: [],
            hours: 0,
            hourRate: client.hourRate,
            forInvoicing: 0,
            rows: 0
        };

        projects?.filter(project => project.clientId == client.id).forEach(project => {
            let projectData = {
                project: project.name,
                tasks: [],
                hours: 0,
                hourRate: clientData.hourRate,
                forInvoicing: 0,
                rows: 0
            }
            if (project.hourRate > 0) {
                projectData.hourRate = project.hourRate;
            }

            tasks?.filter(task => task.projectId == project.id).forEach(task => {
                let taskData = {task: task.name, taskTimetracks: [], hours: 0, forInvoicing: 0, rows: 0};
                taskTimetracks?.filter(taskTimetrack => taskTimetrack.taskId == task.id).forEach(taskTimetrack => {
                    let taskTimetrackData = {
                        start: new Date(taskTimetrack.datetimeStart.date).toLocaleDateString() + " " + new Date(taskTimetrack.datetimeStart.date).toLocaleTimeString(),
                        stop: new Date(taskTimetrack.datetimeStop.date).toLocaleTimeString(),
                    }
                    let spendingSeconds = (new Date(taskTimetrack.datetimeStop.date).getTime() / 1000) - (new Date(taskTimetrack.datetimeStart.date).getTime() / 1000)
                    let spendingHours = spendingSeconds / 60 / 60;

                    let calculator = new BudgetCalculator(spendingSeconds, task, project, client);
                    let forInvoicing = calculator.calculareForInvoincing();

                    taskData.hours += spendingHours;
                    projectData.hours += spendingHours;
                    clientData.hours += spendingHours;
                    report.hours += spendingHours;

                    taskData.forInvoicing += forInvoicing;
                    projectData.forInvoicing += forInvoicing;
                    clientData.forInvoicing += forInvoicing;
                    report.forInvoicing += forInvoicing;

                    taskData.rows++;
                    projectData.rows++;
                    clientData.rows++;
                    report.rows++;

                    taskData.taskTimetracks.push(taskTimetrackData);
                })

                if (taskData.hours > 0) {
                    projectData.tasks.push(taskData);
                }
            })

            if (projectData.hours > 0) {
                clientData.projects.push(projectData);
            }

        })

        if (clientData.hours > 0) {
            report.clients.push(clientData);
        }
    });

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Reporty</h1></div>
            </div>

            <h2 className="h5 mb-3 text-center">{locale._months_fullname[date.getMonth()]} {date.getFullYear()}</h2>
            <p className="text-center">{firstDate}. {month}. {year} - {lastDate}. {month}. {year}</p>

            {report?.clients?.length > 0 ? (
                <div className="card border-0 shadow mb-4">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-centered table-nowrap mb-0 rounded">
                                <thead className="thead-light">
                                <tr>
                                    <th className="border-0 rounded-start-bottom">Klienti</th>
                                    <th className="border-0">Projekty</th>
                                    <th className="border-0">Úkoly</th>
                                    <th className="border-0">Časové záznamy</th>
                                    <th className="border-0">Hodin</th>
                                    <th className="border-0 rounded-end">K fakturaci</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="fw-bold" style={{borderBottomWidth:"2px"}} colSpan={4}>
                                        Celkem:
                                    </td>
                                    <td className="fw-bold  text-end" style={{borderBottomWidth:"2px"}}>
                                        {(new BudgetCalculator)._formatTimeNicely(report.hours * 60 * 60)}
                                    </td>
                                    <td className="fw-bold text-end" style={{borderBottomWidth:"2px"}}>
                                        {(new BudgetCalculator)._numberFormat(report.forInvoicing, 0, ".", " ")} Kč
                                    </td>
                                </tr>
                                {report.clients.map((clientData, clientData_index) => (
                                    <React.Fragment key={clientData_index}>
                                        {clientData.projects.map((projectData, projectData_index) => (
                                            <React.Fragment key={projectData_index}>
                                                {projectData.tasks.map((taskData, taskData_index) => (
                                                    <React.Fragment key={taskData_index}>
                                                        {taskData.taskTimetracks.map((taskTimetrack, taskTimetrack_index) => (
                                                            <React.Fragment
                                                                key={taskTimetrack_index}>
                                                                <tr>
                                                                    {projectData_index == 0 && taskData_index == 0 && taskTimetrack_index == 0 && (
                                                                        <td rowSpan={clientData.rows}>{clientData.client}</td>
                                                                    )}
                                                                    {taskData_index == 0 && taskTimetrack_index == 0 && (
                                                                        <td style={{whiteSpace: "normal"}}
                                                                            rowSpan={projectData.rows}>{projectData.project}</td>
                                                                    )}
                                                                    {taskTimetrack_index == 0 && (
                                                                        <td style={{whiteSpace: "normal"}}
                                                                            rowSpan={taskData.rows}>{taskData.task}</td>
                                                                    )}
                                                                    <td>{taskTimetrack.start} - {taskTimetrack.stop}</td>
                                                                    {projectData_index == 0 && taskData_index == 0 && taskTimetrack_index == 0 && (
                                                                        <>
                                                                            <td rowSpan={clientData.rows}
                                                                                className="text-end">
                                                                                {(new BudgetCalculator)._formatTimeNicely(clientData.hours*60*60)}
                                                                            </td>
                                                                            <td rowSpan={clientData.rows}
                                                                                className="text-end">
                                                                                {(new BudgetCalculator)._numberFormat(clientData.forInvoicing, 0, ".", " ")} Kč
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                </tr>
                                                            </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                "Žádná data"
            )}
        </>
    );
};

export default Reports;