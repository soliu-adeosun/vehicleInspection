import * as React from "react";

import { Outlet } from "react-router-dom";
import GlobalSideNav from "../Navigation/GlobalSideNav";
import GlobalTopNav from "../Navigation/GlobalTopNav";
import '@fortawesome/fontawesome-free/css/all.min.css';

// import { Helmet } from 'react-helmet-async';

import "notyf/notyf.min.css";
import Modal from "../Modals/Modal";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";

import '../Assets/css/sharepointuifix.css';
import "../Assets/css/style.css";

require("speedpoint_core");
require("workflowengine");
require("global");
require("notyf");
require("jQueryUI");
require("globalext");
require("select2");

export const Layout = () => {
    // Sidebar open/closed state lives here so both GlobalTopNav (the button
    // that opens it) and GlobalSideNav (the panel + overlay that close it)
    // can read and update the same value. CSS expects .sidebar.open and
    // .sidebar-overlay.show below the 700px breakpoint (see style.css).
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Admin view toggle also lives here since it changes which nav items
    // GlobalSideNav shows. CSS drives visibility via .admin-only-nav.visible.
    const [isAdminView, setIsAdminView] = React.useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            {/* <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Public+Sans:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
                />
                <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
                />
            </Helmet> */}

            <div className="app-shell">
                <GlobalSideNav
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                    isAdminView={isAdminView}
                    onToggleAdminView={setIsAdminView}
                />
                <div className="main">
                    <GlobalTopNav onToggleSidebar={toggleSidebar} />
                    <main className="page-content" id="main-content" tabIndex={-1}>
                        <Outlet />
                    </main>
                </div>
            </div>
            <Modal />
        </>
    );
};

export default Layout;