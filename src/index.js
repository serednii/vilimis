import { createRoot } from 'react-dom/client';
import React, {useEffect, useReducer, useState} from "react";
import './styles/index.sass';
import Workflow from "./pages/Workflow";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import EntityPage from "./pages/EntityPage";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import RootContext from "./contexts/RootContext";
import { loaderReducer } from "./reducers/loaderReducer";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { LineWave } from "react-loader-spinner";
import APIService from "./services/APIService";
import Clients from "./pages/Clients";
import EndCustomer from "./pages/EndCustomer";
import EndCustomerContact from "./pages/EndCustomerContact";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import TimeTracker from './components/TimeTracer/TimeTracker';
import {TIMETRACKER_ACTIONS, timetrackerReducer} from "./reducers/timetrackerReducer";
import ClientContact from "./pages/ClientContact";
import Webs from "./pages/Webs";
import Breadcrumb from './components/Breadcrumb/Breadcrumb';
import Login from "./pages/Login";
library.add(fas);

function Root() {
    const [user, setUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [jwt, setJwt] = useState(null);
    const [loaderState, loaderDispatch] = useReducer(loaderReducer, { show: 0 });
    const [timetrackerState, timetrackerDispatch] = useReducer(timetrackerReducer, { start: null, taskId: null });

    const locale = {
        "cs": {
            "_months": ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro']
        },
        "en": {
            "_months": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    };
    const locale_selected = "cs";

    const [urlToTitle, setUrlToTitle] = useState('')
    const API = new APIService(
        loaderDispatch,
        toast,
        jwt
    );

    useEffect(() => {
        const timetrackerData = localStorage.getItem("timetracker");
        if (timetrackerData) {
            try {
                const timetracker = JSON.parse(timetrackerData);
                if (timetracker && "taskId" in timetracker && "start" in timetracker) {
                    timetrackerDispatch({
                        action: TIMETRACKER_ACTIONS.SET_START,
                        ...timetracker
                    });
                }
            } catch (e) {console.log(e)}
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setJwt(null);
    }

    useEffect(() => {
        if (!jwt) {
            let jwtLocal = localStorage.getItem("jwt");
            setJwt(jwtLocal)
        }
    }, []);

    useEffect(() => {
        if (jwt) {
            console.log(jwt);
            const userId = JSON.parse(window.atob(jwt.split(".")[1].replace("-","+").replace("_","/"))).id;

            if (userId) {
                API.getData("/user/single/" + userId, (user) => {
                    setUser(user);
                });
                return;
            }
        }
        setUser(null);
    }, [jwt]);

    useEffect(() => {
        localStorage.setItem("timetracker", JSON.stringify(timetrackerState));
    }, [timetrackerState]);


    const providerState = {
        loaderState,
        loaderDispatch,
        timetrackerState,
        timetrackerDispatch,
        toast,
        API,
        locale: locale[locale_selected],
        setUrlToTitle,
        urlToTitle,
        setJwt
    }

    return (<RootContext.Provider value={providerState}>

        {user ? (

        <BrowserRouter>
            <nav id="sidebarMenu" className="sidebar d-lg-block bg-gray-800 text-white collapse" data-simplebar>
                <div className="sidebar-inner px-4 pt-3">
                    <div
                        className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                        <div className="d-flex align-items-center">
                            <div className="avatar-lg me-4">
                                <img src="/gephart/images/face.jpg"
                                    className="card-img-top rounded-circle border-white"
                                    alt="Gephart" />
                            </div>
                            <div className="d-block">
                                <h2 className="h5 mb-3">Hi, Jane</h2>
                                <a href="../../pages/examples/sign-in.html"
                                    className="btn btn-secondary btn-sm d-inline-flex align-items-center">
                                    <svg className="icon icon-xxs me-1" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Sign Out
                                </a>
                            </div>
                        </div>
                        <div className="collapse-close d-md-none">
                            <a href="#sidebarMenu" data-bs-toggle="collapse"
                                data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="true"
                                aria-label="Toggle navigation">
                                <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="gephart-menu-logo">
                        <img src="/gephart/images/gephart-is-black-white.svg" width="503" alt="Gephart Logo" />
                    </div>
                    <ul className="nav flex-column pt-3 pt-md-0">
                        <li className="nav-item ">
                            <NavLink to="/" className="nav-link">
                                <span className="sidebar-icon">
                                    <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg"><path
                                        d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path
                                        d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                </span>
                                <span className="sidebar-text">Přehled</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/webs"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
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
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Úkoly</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/projects"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Projekty</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/end-customer-contacts"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Koncoví zákazníci - kontakty</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/end-customers"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Koncoví zákazníci</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/client-contacts"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Klienti - kontakty</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/clients"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                    <span className="sidebar-text">Klienti</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item ">
                            <NavLink to="/entity"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg"><path
                                            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    </span>
                                    <span className="sidebar-text">Entity</span>
                                </span>
                            </NavLink>
                        </li>
                        <li className="nav-item ">
                            <NavLink to="/workflow"
                                     className="nav-link d-flex justify-content-between">
                                <span>
                                    <span className="sidebar-icon">
                                        <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg"><path
                                            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    </span>
                                    <span className="sidebar-text">Workflow</span>
                                </span>
                            </NavLink>
                        </li>
                        <li role="separator" className="dropdown-divider mt-4 mb-3 border-gray-700"></li>
                        <li className="nav-item">
                            <a href="https://themesberg.com/docs/volt-bootstrap-5-dashboard/getting-started/quick-start/"
                               target="_blank"
                               className="nav-link d-flex align-items-center">
                                <span className="sidebar-icon">
                                    <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg"><path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"></path></svg>
                                </span>
                                <span className="sidebar-text">Dokumentace
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="content">

                <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0">
                    <div className="container-fluid px-0">
                        <div className="d-flex justify-content-between align-items-center w-100" id="navbarSupportedContent">
                            <div className="d-flex align-items-center">
                                <form className="navbar-search form-inline" id="navbar-search-main">
                                    <div className="input-group input-group-merge search-bar">
                                        <span className="input-group-text" id="topbar-addon">
                                            <svg className="icon icon-xs" x-description="Heroicon name: solid/search"
                                                 xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd"
                                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                        </span>
                                        <input type="text" className="form-control" id="topbarInputIconLeft"
                                            placeholder="Vyhledávat"
                                            aria-label="Vyhledat" aria-describedby="topbar-addon" />
                                    </div>
                                </form>
                            </div>
                            <div className="flex-fill"></div>

                            <TimeTracker />

                            <ul className="navbar-nav align-items-center">
                                <li className="nav-item dropdown ms-lg-3">
                                    <button onClick={()=>setShowUserDropdown(!showUserDropdown)} className="nav-link dropdown-toggle pt-1 px-0" href="#" role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <div className="media d-flex align-items-center">
                                            <img className="avatar rounded-circle" alt="Image placeholder"
                                                src="/gephart/images/face.jpg" />
                                            <div
                                                className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                                <span
                                                    className="mb-0 font-small fw-bold text-gray-900">Michal Katuščák</span>
                                            </div>
                                        </div>
                                    </button>
                                    <div className="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1"
                                        style={{opacity:showUserDropdown?1:0,pointerEvents:showUserDropdown?"all":"none"}}
                                    >
                                        {/*<a className="dropdown-item d-flex align-items-center" href="#">
                                            <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            My Profile
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            Settings
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            Messages
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                            Support
                                        </a>
                                        <div role="separator" className="dropdown-divider my-1"></div>*/}
                                        <button onClick={logout} className="dropdown-item d-flex align-items-center" href="#">
                                            <svg className="dropdown-icon text-danger me-2" fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            Odhlásit
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>


                <div className="py-4">

                    <Breadcrumb />
                    {/* <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
                        <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                            <li className="breadcrumb-item"><a href="#">
                                <svg className="icon icon-xxs" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                            </a></li>
                            <li className="breadcrumb-item"><a href="#">Workflow</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Editace</li>
                        </ol>
                    </nav> */}
                    {/*<div className="d-flex justify-content-between w-100 flex-wrap">
                    <div className="mb-3 mb-lg-0"><h1 className="h4">Obchodní příležitost - změna stavu na
                        odesláno</h1>
                    </div>
                </div>*/}
                </div>

                <div style={{
                    position: "fixed",
                    bottom: "0px",
                    right: "0px",
                    zIndex: 999,
                    opacity: loaderState.show > 0 ? 1 : 0,
                    transition: "opacity .2s"
                }}>
                    <LineWave
                        visible={loaderState.show}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="line-wave-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        firstLineColor=""
                        middleLineColor=""
                        lastLineColor=""
                    />
                </div>

                <ToastContainer
                    position="bottom-left"
                    autoClose={2000}
                    theme={"colored"}
                />
                <Routes>
                    {/*<Route path="/" element={<Layout/>}>*/}
                    <Route index element={<Home />} />
                    <Route path="end-customer-contacts/*" element={<EndCustomerContact />} />
                    <Route path="end-customer-contact" element={<EndCustomerContact />} />
                    <Route path="client-contacts/*" element={<ClientContact />} />
                    <Route path="client-contact" element={<ClientContact />} />
                    <Route path="webs/*" element={<Webs />} />
                    <Route path="webs" element={<Webs />} />
                    <Route path="end-customers/*" element={<EndCustomer />} />
                    <Route path="end-customer" element={<EndCustomer />} />
                    <Route path="clients/*" element={<Clients />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="projects/*" element={<Projects />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="tasks/*" element={<Tasks />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="workflow" element={<Workflow />} />
                    <Route path="entity/*" element={<EntityPage />} />
                    <Route path="entity" element={<EntityPage />} />
                    <Route path="*" element={<NoPage />} />
                    {/*</Route>*/}
                </Routes>
            </main>

        </BrowserRouter>
        ) : (
            <BrowserRouter>
                <Routes>
                <Route path="*" element={<Login />} />
                </Routes>
            </BrowserRouter>
        )}
    </RootContext.Provider>)
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root />);
