import {NavLink, useLocation} from "react-router-dom";
import {
    ArrowArcRight,
    CheckSquare, CurrencyDollar,
    FolderSimple, Gear, Invoice, ListChecks,
    Network,
    Speedometer, SquaresFour, Table,
    Timer, TreeStructure,
    UserCircle,
    Users
} from "@phosphor-icons/react";
import React, {useEffect} from "react";
import {useRootContext} from "../../contexts/RootContext";

const Menu = ({closeMobileMenu}) => {
    const {user, logout, diskSpace} = useRootContext();
    let location = useLocation();

    useEffect(() => {
        closeMobileMenu();
    }, [location]);

    return (<>
        <div className="user-menu d-flex flex-column justify-content-between">
            <div>
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
                        <NavLink to="/checklists"
                                 className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <ListChecks/>
                                    </span>
                                    <span className="sidebar-text">Checklisty</span>
                                </span>
                        </NavLink>
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
                        <NavLink to="/costs"
                                 className="nav-link d-flex justify-content-between">
                                        <span>
                                            <span className="sidebar-icon">
                                                <CurrencyDollar/>
                                            </span>
                                            <span className="sidebar-text">Náklady</span>
                                        </span>
                            <span className="link-arrow"><ArrowArcRight/></span>
                        </NavLink>
                        <div className="multi-level" role="list">
                            <ul className="flex-column nav">
                                <li className="nav-item">

                                    <NavLink to="/costs/categories/"
                                             className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Kategorie</span>
                                                    </span>
                                    </NavLink>
                                    <NavLink to="/costs/repeatables/"
                                             className="nav-link d-flex justify-content-between">
                                                    <span>
                                                        <span className="sidebar-text">Opakované</span>
                                                    </span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
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
            </div>

            {diskSpace !== null && diskSpace?.code == 200 && parseInt(diskSpace.quotaInMb) >= 0 && (

                <div className="my-5 disk-space">
                    <div className="progress-wrapper">
                        <div className="progress-info">
                            <div className="h6 mb-0">{diskSpace.usedSpaceInMb} MB</div>
                            <div className="small fw-bold text-gray-500"><span>{diskSpace.quotaInMb} MB</span></div>
                        </div>
                        <div className="progress mb-0">
                            <div className="progress-bar bg-success" role="progressbar" aria-valuenow="100"
                                 aria-valuemin="0"
                                 aria-valuemax="100" style={{width: diskSpace.usedPercent + "%"}}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>)
}

export default Menu;