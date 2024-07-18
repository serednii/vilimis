import React from "react";
import {CONFIG} from "../config";

class ProjectUtils {
    constructor(project, projectStatuses, clients, endCustomers) {
        this.project = project;
        this.client = null;
        this.endCustomer = null;
        this.projectStatus = null;
        this.deadLineDateFormated = "";
        if (project?.deadLineDate?.date) {
            this.deadLineDateFormated = new Date(project.deadLineDate.date).toLocaleDateString()
        }

        const projectStatus = projectStatuses?.filter(projectStatus => projectStatus.id == project.projectStatusId)?.[0];
        this.projectStatus = projectStatus;

        let isImg = false;
        let imgUrl = "";

        const client = clients?.filter(client => client.id == project.clientId)?.[0];
        this.client = client;

        const endCustomer = endCustomers.filter(endCustomer => endCustomer.id == project.endCustomerId)?.[0];
        this.endCustomer = endCustomer;

        if (!isImg && project?.endCustomerId) {
            if (endCustomer?.logo) {
                isImg = true
                imgUrl = CONFIG.uploadDir + endCustomer.logo;
            }
        }

        if (!isImg && project?.clientId) {
            if (client?.logo) {
                isImg = true
                imgUrl = CONFIG.uploadDir + client.logo;
            }
        }

        this.imgUrl = imgUrl;
        this.isImg = isImg;
    }

}

export default ProjectUtils;