import React, {useCallback, useState} from "react";
import TasksKanbanItem from "./TasksKanbanItem";
import {useDrop} from 'react-dnd'
import update from 'immutability-helper'
import TasksKanbanItemBlank from "./TasksKanbanItemBlank";
import {useRootContext} from "../../contexts/RootContext";
import TasksWeekKanbanItemBlank from "./TasksWeekKanbanItemBlank";
import TasksWeekKanbanItem from "./TasksWeekKanbanItem";

const TasksWeekKanbanColumn = ({day, date, tasks, clients, setReload, projects, endCustomers, moveCard}) => {
    const {locale} = useRootContext();

    return (
        <>
            <div className="col-12 col-lg-6 col-xl-4 col-xxl-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fs-6 fw-bold mb-0">
                        {date ? (
                            <>
                                {locale._days_fullname[date.getDay()]} ({date.getDate()}.)
                            </>
                        ) : ("K naplánování:")}
                    </h5>
                </div>


                <div className="list-group kanban-list">
                    {tasks && tasks.length > 0 && tasks.map((task, task_index) => (
                        <TasksWeekKanbanItem
                            key={task.id + "-" + task_index}
                            id={task.id}
                            index={task_index}
                            task={task}
                            projects={projects}
                            endCustomers={endCustomers}
                            clients={clients}
                            day={day}
                            date={date}
                            moveCard={moveCard}
                            onUpdate={() => setReload(true)}/>
                    ))}

                    {!tasks || tasks.length == 0 && (
                        <TasksWeekKanbanItemBlank moveCard={moveCard} id="0" index="-1"
                                              day={day}
                                              date={date}
                        />
                    )}


                </div>
            </div>
        </>
    );
};

export default TasksWeekKanbanColumn;