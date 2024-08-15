import {createRoot} from 'react-dom/client';
import React, {useEffect, useReducer, useState} from "react";
import './styles/index.sass';
import Workflow from "./pages/Workflow";
import {BrowserRouter, createBrowserRouter, NavLink, Route, Routes, useLocation} from "react-router-dom";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import EntityPage from "./pages/EntityPage";
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import RootContext from "./contexts/RootContext";
import {loaderReducer} from "./reducers/loaderReducer";
import {ToastContainer, toast} from "react-toastify";
import 'boxicons'
import 'react-toastify/dist/ReactToastify.css';
import {LineWave} from "react-loader-spinner";
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
import MD5 from "crypto-js/md5";

import TimeTracks from "./pages/TimeTracks";
import Reports from "./pages/Reports";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import TopUserInfo from "./components/_page/TopUserInfo";
import Menu from "./components/_page/Menu";
import Checklists from "./pages/Checklists";
import Costs from "./pages/Costs";
import Licenses from "./pages/Licenses";

function Root() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [diskSpace, setDiskSpace] = useState(null);
    const [jwt, setJwt] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [loaderState, loaderDispatch] = useReducer(loaderReducer, {show: 0});
    const [openedMenuIndex, setOpenedMenuIndex] = useState(0);

    const locale = {
        "cs": {
            "_days": ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
            "_days_fullname": ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
            "_months_numbers": ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            "_months": ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
            "_months_fullname": ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
        },
        "en": {
            "_months": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            "_months_fullname": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    };
    const locale_selected = "cs";

    const [urlToTitle, setUrlToTitle] = useState('')
    const API = new APIService(
        loaderDispatch,
        toast,
        jwt
    );

    const [timetrackerState, timetrackerDispatch] = useReducer(timetrackerReducer, {start: null, taskId: null, api: API});

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
            } catch (e) {
                console.log(e)
            }
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setJwt(null);
    }

    useEffect(() => {
        if (!jwt) {
            let jwtLocal = localStorage.getItem("jwt");
            setJwt(jwtLocal);
        }
    }, []);

// And instead of history.listen you can:
    function closeMobileMenu() {
        if (showMobileMenu) {
            setShowMobileMenu(false);
        }
    }


    const reloadUser = () => {
        setLoading(true);
        if (jwt) {
            const userId = JSON.parse(window.atob(jwt.split(".")[1].replace("-", "+").replace("_", "/"))).id;

            if (userId) {
                API.getData("/disk-space/", (data) => {
                    setDiskSpace(data);
                });

                API.getData("/user/single/" + userId, (user) => {
                    setUser(user);
                    setLoading(false);
                });
                return;
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        reloadUser();

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
        setJwt,
        user,
        diskSpace,
        reloadUser,
        logout
    }

    return (<RootContext.Provider value={providerState}>
        {loading ? (
            <>
                <div style={{
                    position: "fixed",
                    top: "calc(50% - 50px)",
                    left: "calc(50% - 50px)",
                    zIndex: 999,
                }}>
                    <LineWave
                        visible={true}
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
            </>
        ) : (
            user ? (
                <BrowserRouter>

                    <nav className="navbar navbar-dark navbar-theme-primary px-4 col-12 d-lg-none">
                        <a className="navbar-brand me-lg-5" href="../../index.html">
                            <img
                                className="navbar-brand-dark"
                                src="/gephart/images/logo-white.svg"
                                alt="VilémIS logo"
                            />
                            <img
                                className="navbar-brand-light"
                                src="/gephart/images/logo-black.svg"
                                alt="VilémIS logo"
                            />
                        </a>
                        <div className="d-flex align-items-center">

                            <div className="me-3">
                                <TimeTracker/>
                            </div>

                            <button
                                onClick={()=>setShowMobileMenu(prev=>!prev)}
                                className="navbar-toggler d-lg-none collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#sidebarMenu"
                                aria-controls="sidebarMenu"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </nav>

                    <nav id="sidebarMenu" className={"sidebar d-lg-block bg-gray-800 text-white collapse" + (showMobileMenu?" show":"")} data-simplebar>
                        <div className="sidebar-inner px-4 pt-3">

                            <div
                                className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                                    <div className="d-flex">
                                        <div className="avatar-lg me-4">
                                            <img
                                                src={user.avatar ? user.avatar : "http://www.gravatar.com/avatar/" + MD5(user.username) + "?s=64&d=mm"}
                                                className="card-img-top rounded-circle border-white"
                                                alt="Gephart"/>
                                        </div>
                                        <div className="d-block">
                                            <h2 className="h5 mb-3">{user.name} {user.surname}</h2>
                                            <button onClick={logout}
                                                    className="btn btn-secondary btn-sm d-inline-flex align-items-center">
                                                <svg className="icon icon-xxs me-1" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                                </svg>
                                                Odhlásit
                                            </button>
                                        </div>
                                    </div>
                                    <div className="collapse-close d-md-none">
                                        <a href="#sidebarMenu" data-bs-toggle="collapse"
                                           onClick={()=>setShowMobileMenu(prev=>!prev)}
                                           data-bs-target="#sidebarMenu" aria-controls="sidebarMenu"
                                           aria-expanded="true"
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

                            <Menu closeMobileMenu={closeMobileMenu}/>
                        </div>
                    </nav>

                    <main className="content">

                        <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-4">
                            <div className="container-fluid px-0">
                                <div className="d-flex justify-content-between align-items-center w-100"
                                     id="navbarSupportedContent">
                                    {/*
                                    <div className="d-flex align-items-center">
                                        <form className="navbar-search form-inline" id="navbar-search-main">
                                            <div className="input-group input-group-merge search-bar">
                                        <span className="input-group-text" id="topbar-addon">
                                            <MagnifyingGlass size={16}/>
                                        </span>
                                                <input type="text" className="form-control" id="topbarInputIconLeft"
                                                       placeholder="Vyhledávat"
                                                       aria-label="Vyhledat" aria-describedby="topbar-addon"/>
                                            </div>
                                        </form>
                                    </div>
                                    */}
                                    <div className="flex-fill"></div>

                                    <TimeTracker/>

                                    <ul className="navbar-nav align-items-center">
                                        <li className="nav-item dropdown ms-lg-3">
                                            <TopUserInfo/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>

                        {/*
                        <div className="py-4 navbar-breadcrumb">
                            <Breadcrumb/>
                        </div>
                        */}

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
                            <Route index element={<Home/>}/>
                            <Route path="costs/*" element={<Costs/>}/>
                            <Route path="costs" element={<Costs/>}/>
                            <Route path="end-customer-contacts/*" element={<EndCustomerContact/>}/>
                            <Route path="end-customer-contact" element={<EndCustomerContact/>}/>
                            <Route path="client-contacts/*" element={<ClientContact/>}/>
                            <Route path="client-contact" element={<ClientContact/>}/>
                            <Route path="webs/*" element={<Webs/>}/>
                            <Route path="webs" element={<Webs/>}/>
                            <Route path="end-customers/*" element={<EndCustomer/>}/>
                            <Route path="end-customer" element={<EndCustomer/>}/>
                            <Route path="clients/*" element={<Clients/>}/>
                            <Route path="clients" element={<Clients/>}/>
                            <Route path="projects/*" element={<Projects/>}/>
                            <Route path="projects" element={<Projects/>}/>
                            <Route path="tasks/*" element={<Tasks/>}/>
                            <Route path="tasks" element={<Tasks/>}/>
                            <Route path="workflow" element={<Workflow/>}/>
                            <Route path="entity/*" element={<EntityPage/>}/>
                            <Route path="entity" element={<EntityPage/>}/>
                            <Route path="invoices/*" element={<Invoices/>}/>
                            <Route path="invoices" element={<Invoices/>}/>
                            <Route path="time-tracks/*" element={<TimeTracks/>}/>
                            <Route path="time-tracks" element={<TimeTracks/>}/>
                            <Route path="reports/*" element={<Reports/>}/>
                            <Route path="reports" element={<Reports/>}/>
                            <Route path="checklists" element={<Checklists/>}/>
                            <Route path="settings" element={<Settings/>}/>
                            <Route path="licenses" element={<Licenses/>}/>
                            <Route path="*" element={<NoPage/>}/>
                            {/*</Route>*/}
                        </Routes>
                    </main>

                </BrowserRouter>
            ) : (
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<Login/>}/>
                    </Routes>
                </BrowserRouter>
            )
        )}

    </RootContext.Provider>)
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root/>);
