import {useRootContext} from "../contexts/RootContext";
import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";
import ProjectDatesListDashboard from "../components/Dashboard/ProjectDatesListDashboard";
import React, {useEffect, useRef, useState} from "react";
import BudgetCalculator from "../utils/BudgetCalculator";
import html2pdf from 'html2pdf.js';

const Reports = ({}) => {
    const {API, locale} = useRootContext()

    const [reload, setReload] = useState(true);
    const [taskTimetracks, setTaskTimetracks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const pdfRef = useRef(null);


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

    const exportToPdf = () =>
    {
        const options = {
            filename: 'report.pdf',
            margin: 0.5,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        const content = pdfRef.current;

        html2pdf().set(options).from(content).save();
    }

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

            <button className="btn btn-primary" onClick={exportToPdf}>Export do PDF</button>

            <div ref={pdfRef}>
                <h2 className="h5 mb-3 text-center">{locale._months_fullname[date.getMonth()]} {date.getFullYear()}</h2>
                <p className="text-center">{firstDate}. {month}. {year} - {lastDate}. {month}. {year}</p>

                {report?.clients?.length > 0 ? (
                    <React.Fragment>
                        {report.clients.map((clientData, clientData_index) => (
                            <React.Fragment key={clientData_index}>

                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h3 className="mb-0 h4">{clientData.client}</h3>
                                    </div>
                                    <div className="card-body">
                                        {clientData.projects.map((projectData, projectData_index) => (
                                            <React.Fragment key={projectData_index}>

                                                <div className="card mb-3">
                                                    <div className="card-header">
                                                        <h3 className="mb-0 h5">{projectData.project}</h3>
                                                    </div>
                                                    <div className="card-body">
                                                        <table className="table rounded">
                                                            {/*<thead>
                                                        <tr>
                                                            <th>Úkol</th>
                                                            <th className="text-end">Čas</th>
                                                            <th className="text-end">Cena</th>
                                                        </tr>
                                                        </thead>*/}
                                                            <tbody>
                                                            {projectData.tasks.map((taskData, taskData_index) => (
                                                                <React.Fragment key={taskData_index}>

                                                                    <tr>
                                                                        <td>
                                                                            {taskData.task}


                                                                            {taskData.taskTimetracks.map((taskTimetrack, taskTimetrack_index) => (
                                                                                <React.Fragment
                                                                                    key={taskTimetrack_index}>
                                                                                    <br/>
                                                                                    <small
                                                                                        className="ms-2 text-gray-400">
                                                                                        {taskTimetrack.start} - {taskTimetrack.stop}
                                                                                    </small>
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </td>
                                                                        <td style={{width:"5rem"}} className="text-end"> {(new BudgetCalculator)._formatTimeNicely(taskData.hours * 60 * 60)}</td>
                                                                        <td style={{width:"5rem"}} className="text-end">{(new BudgetCalculator)._numberFormat(taskData.forInvoicing, 0, ".", " ")} Kč</td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            ))}

                                                            <tr className="thead-light total-row">
                                                                <th className="rounded-start border-0">Celkem za
                                                                    projekt
                                                                </th>
                                                                <th className="text-end border-0"> {(new BudgetCalculator)._formatTimeNicely(projectData.hours * 60 * 60)}</th>
                                                                <th className="text-end border-0 rounded-end">{(new BudgetCalculator)._numberFormat(projectData.forInvoicing, 0, ".", " ")} Kč</th>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}


                                        <div className="mt-3">
                                            <h4 className="text-end h5">
                                                Celkem za klienta:&nbsp;
                                                {(new BudgetCalculator)._formatTimeNicely(clientData.hours * 60 * 60)} / {(new BudgetCalculator)._numberFormat(clientData.forInvoicing, 0, ".", " ")} Kč
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        <div className="card mb-4">
                            <div className="card-body">
                                <h3 className="text-end mb-0 h4">Celkem za všechny klienty:&nbsp;
                                    {(new BudgetCalculator)._formatTimeNicely(report.hours * 60 * 60)} / {(new BudgetCalculator)._numberFormat(report.forInvoicing, 0, ".", " ")} Kč
                                </h3>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    "Žádná data"
                )}
            </div>
        </>
    );
};

export default Reports;