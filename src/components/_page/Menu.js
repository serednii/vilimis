import {NavLink} from "react-router-dom";
import {
    ArrowArcRight,
    CheckSquare,
    FolderSimple, Gear, Invoice,
    Network,
    Speedometer, SquaresFour, Table,
    Timer, TreeStructure,
    UserCircle,
    Users
} from "@phosphor-icons/react";
import React from "react";
import {useRootContext} from "../../contexts/RootContext";

const Menu  = () => {
    const {user, logout} = useRootContext();

    return (<>

        <div className="gephart-menu-logo">
            <img src="/gephart/images/logo-white.svg" width="503" alt="VilémIS Logo"/>
        </div>
        <ul className="nav flex-column pt-3 pt-md-0">
            <li className="nav-item ">
                <NavLink to="/" className="nav-link">
                                <span className="sidebar-icon">
                                    <Speedometer/>
                                </span>
                    <span className="sidebar-text">Nástěnka</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/time-tracks"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                         <Timer/>
                                    </span>
                                    <span className="sidebar-text">Časové záznamy</span>
                                </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/webs"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <Network/>
                                    </span>
                                    <span className="sidebar-text">Weby</span>
                                </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/tasks"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                         <CheckSquare/>
                                    </span>
                                    <span className="sidebar-text">Úkoly</span>
                                </span>
                    <span className="link-arrow"><ArrowArcRight/></span>
                </NavLink>
                <div className="multi-level" role="list">
                    <ul className="flex-column nav">
                        <li className="nav-item">

                            <NavLink to="/tasks/list"
                                     className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Dle stavu</span>
                                                    </span>
                            </NavLink>
                            <NavLink to="/tasks/week"
                                     className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Týdenní plán</span>
                                                    </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <NavLink to="/projects" className="nav-link d-flex justify-content-between">
                                        <span>
                                            <span className="sidebar-icon">
                                                 <FolderSimple/>
                                            </span>
                                            <span className="sidebar-text">Projekty</span>
                                        </span>
                    <span className="link-arrow"><ArrowArcRight/></span>
                </NavLink>
                <div className="multi-level" role="list">
                    <ul className="flex-column nav">
                        <li className="nav-item">

                            <NavLink to="/projects/list"
                                     className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Dle stavu</span>
                                                    </span>
                            </NavLink>
                            <NavLink to="/projects/year"
                                     className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Roční plán</span>
                                                    </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <NavLink to="/end-customers"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <UserCircle/>
                                    </span>
                                    <span className="sidebar-text">Koncoví zákazníci</span>
                                </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/clients"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <Users/>
                                    </span>
                                    <span className="sidebar-text">Klienti</span>
                                </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/invoices"
                         className="nav-link d-flex justify-content-between">
                                        <span>
                                            <span className="sidebar-icon">
                                                <Invoice/>
                                            </span>
                                            <span className="sidebar-text">Faktury</span>
                                        </span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/reports"
                         className="nav-link d-flex justify-content-between">
                                        <span>
                                            <span className="sidebar-icon">
                                                <Table/>
                                            </span>
                                            <span className="sidebar-text">Reporty</span>
                                        </span>
                </NavLink>
            </li>


            <li role="separator" className="dropdown-divider mt-4 mb-3 border-gray-700"></li>

            {/*

            <li className="nav-item ">
                <NavLink to="/workflow"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <TreeStructure/>
                                    </span>
                                    <span className="sidebar-text">Workflow</span>
                                </span>
                </NavLink>
            </li>
            <li className="nav-item ">
                <NavLink to="/entity"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <SquaresFour/>
                                    </span>
                                    <span className="sidebar-text">Entity</span>
                                </span>
                </NavLink>
            </li>
            */}
            <li className="nav-item ">
                <NavLink to="/settings"
                         className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <Gear/>
                                    </span>
                                    <span className="sidebar-text">Nastavení</span>
                                </span>
                </NavLink>
            </li>
        </ul>
    </>)
}

export default Menu;