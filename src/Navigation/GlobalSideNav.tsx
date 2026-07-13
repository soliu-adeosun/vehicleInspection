import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface GlobalSideNavProps {
    isOpen: boolean;
    onClose: () => void;
    isAdminView: boolean;
    onToggleAdminView: (checked: boolean) => void;
}

const GlobalSideNav: React.FC<GlobalSideNavProps> = ({
    isOpen,
    onClose,
    // isAdminView,
    onToggleAdminView,
}) => {
    const location = useLocation();
    const activeLink = location.pathname;

    const isActive = (path: string) => activeLink === path;

    // style.css drives admin-only items via .admin-only-nav (display: none)
    // and .admin-only-nav.visible (display: block) — match that exactly
    // rather than conditionally rendering the elements.
    // const adminClass = (base: string) =>
    //     `${base} admin-only-nav${isAdminView ? " visible" : ""}`;

    return (
        <>
            {/* Overlay — CSS shows this via .sidebar-overlay.show below 700px */}
            <div
                className={`sidebar-overlay${isOpen ? " show" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`sidebar${isOpen ? " open" : ""}`}
                aria-label="Main navigation"
            >
                <div className="sidebar-brand">
                    <div className="brand-mark">
                        <svg
                            viewBox="160 135 365 385"
                            width="22"
                            height="23"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <polygon
                                fill="white"
                                points="325.29,377.98 275.34,513.01 191.61,513.01 220.29,435.6"
                            />
                            <polygon
                                fill="white"
                                points="357.8,377.98 407.75,513.01 491.49,513.01 462.8,435.6"
                            />
                            <path
                                fill="white"
                                fillRule="evenodd"
                                d="M425.58 144.05l90.89 250.67c-48.07,-12.82 -98.22,-20.54 -149.86,-22.48l-24.75 -193.1 -0.61 0 -24.75 193.03c-51.62,1.82 -101.78,9.4 -149.86,22.1l92.54 -250.21 -1.32 0 168.96 0 -1.24 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="brand-text">Vehicle Inspection</div>
                        {/* <div className="brand-sub">Food Safety</div> */}
                    </div>
                </div>

                <div className="cop-bar" />

                {/* <div className="sidebar-user">
                    <img className="user-avatar" />
                    <div className="user-info">
                        <p id="currentusername"></p>
                        <span className="user-role"></span>
                    </div>
                </div> */}

                <nav className="sidebar-nav" aria-label="Section navigation">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={`nav-item ${isActive("/") ? "active" : ""}`}
                        aria-current={isActive("/") ? "page" : undefined}
                    >
                        <i className="fa-solid fa-bowl-food" aria-hidden="true" />
                        <span className="nav-label">New Inspection</span>
                    </Link>


                    <Link
                        to="/report"
                        onClick={onClose}
                        className={`nav-item ${isActive("/report") ? "active" : ""}`}
                        aria-current={isActive("/report") ? "page" : undefined}
                    >
                        <i className="fa-solid fa-users" aria-hidden="true" />
                        <span className="nav-label">Report</span>
                    </Link>
                </nav>

                {/* <div className="sidebar-footer hidden">
                    <div className="admin-toggle-wrap">
                        <span className="admin-toggle-lbl">
                            <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                            Admin view
                        </span>
                        <label className="toggle" aria-label="Toggle admin view">
                            <input
                                type="checkbox"
                                id="admin-toggle"
                                checked={isAdminView}
                                onChange={(e) => onToggleAdminView(e.target.checked)}
                            />
                            <span className="toggle-track" />
                            <span className="toggle-thumb" />
                        </label>
                    </div>
                </div> */}
            </aside>
        </>
    );
};

export default GlobalSideNav;