import {createRoot} from 'react-dom/client';
import React from "react";
import './styles/index.sass';
import Workflow from "./pages/Workflow";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import EntityPage from "./pages/EntityPage";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

function Root() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<Layout/>}>*/}
                    <Route index element={<Home/>}/>
                    <Route path="workflow" element={<Workflow/>}/>
                    <Route path="entity/*" element={<EntityPage/>}/>
                    <Route path="entity" element={<EntityPage/>}/>
                    <Route path="*" element={<NoPage/>}/>
                {/*</Route>*/}
            </Routes>
        </BrowserRouter>
    )
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root/>);
