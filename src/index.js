import { createRoot } from 'react-dom/client';
import React from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import App from "./App";
import './styles/index.sass';

function Root() {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </div>
    )
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root />);
