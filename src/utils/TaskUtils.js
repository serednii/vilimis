import React from "react";
import {CONFIG} from "../config";

class TaskUtils {
    constructor(task, taskStatuses, projects, clients, endCustomers) {
        this.task = task;
        this.project = null;
        this.client = null;
        this.endCustomer = null;
        this.taskStatus = null;
        this.deadLineDateFormated = "";
        if (task?.deadLineDate?.date) {
            this.deadLineDateFormated = new Date(task.deadLineDate.date).toLocaleDateString()
        }

        const taskStatus = taskStatuses?.filter(taskStatus => taskStatus.id == task?.taskStatusId)?.[0];
        this.taskStatus = taskStatus;

        let isImg = false;
        let imgUrl = "";
        if (task?.projectId) {
            const project = projects?.filter(project => project.id == task?.projectId)?.[0];
            this.project = project;

            const client = clients?.filter(client => client.id == project?.clientId)?.[0];
            this.client = client;

            const endCustomer = endCustomers.filter(endCustomer => endCustomer.id == project?.endCustomerId)?.[0];
            this.endCustomer = endCustomer;

            if (project?.endCustomerId) {
                if (endCustomer?.logo) {
                    isImg = true
                    imgUrl = CONFIG.uploadDir + endCustomer.logo;
                }
                if (!isImg && project?.clientId) {
                    if (client?.logo) {
                        isImg = true
                        imgUrl = CONFIG.uploadDir + client.logo;
                    }
                }
            }
        }

        this.imgUrl = imgUrl;
        this.isImg = isImg;
    }

}

export default TaskUtils;