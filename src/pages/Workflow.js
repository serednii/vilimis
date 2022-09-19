import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import App from "../App";
import React from "react";

const Workflow = ({props}) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    );
};

export default Workflow;