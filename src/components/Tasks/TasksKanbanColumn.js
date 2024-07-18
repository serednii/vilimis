import React, {useCallback, useState} from "react";
import TasksKanbanItem from "./TasksKanbanItem";
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'
import TasksKanbanItemBlank from "./TasksKanbanItemBlank";
    const TasksKanbanColumn = ({taskStatus, tasks, clients, setReload, projects, endCustomers, moveCard}) => {

    return (
        <>
            <div className="col-12 col-lg-6 col-xl-4 col-xxl-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fs-6 fw-bold mb-0">{taskStatus.name}</h5>
                </div>


                <div className="list-group kanban-list">
                    {tasks && tasks.length > 0 && tasks.map((task, task_index) => (
                        <TasksKanbanItem
                            key={task.id+"-"+task_index}
                            id={task.id}
                            taskStatusId={taskStatus.id}
                            index={task_index}
                            task={task}
                            projects={projects}
                            endCustomers={endCustomers}
                            clients={clients}
                            moveCard={moveCard}
                            onUpdate={() => setReload(true)}/>
                    ))}

                    {(!tasks || tasks.length == 0) && (
                        <TasksKanbanItemBlank moveCard={moveCard} id="0" index="-1" taskStatusId={taskStatus.id}/>
                    )}


                </div>
            </div>
        </>
    );
};

export default TasksKanbanColumn;