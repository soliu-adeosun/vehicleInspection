import * as React from "react";
import { useLocation } from "react-router-dom";

interface GlobalTopNavProps {
    onToggleSidebar: () => void;
}

// Maps each route to the title shown in the topbar — mirrors what the
// original HTML set imperatively via id="topbar-title" inside switchView().
const PAGE_TITLES: Record<string, string> = {
    "/": "New Inspection",
    "/report": "Vehicle Inspection Report",
    "/viewrequest": "View Vehicle Inspection"
};

const GlobalTopNav: React.FC<GlobalTopNavProps> = ({ onToggleSidebar }) => {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] ?? "Menu overview";

    return (
        <div className="topbar">
            <div className="topbar-left">
                <button
                    className="menu-btn"
                    id="menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Open menu"
                >
                    <i className="fa-solid fa-bars" aria-hidden="true" />
                </button>
                <h2 className="topbar-title" id="topbar-title">
                    {title}
                </h2>
            </div>
            <div className="topbar-right">
                <div className="sidebar-user">
                    <img className="user-avatar" />
                    <div className="user-info">
                        <p id="currentusername"></p>
                        {/* <span className="user-role"></span> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalTopNav;