// STEP 40: Responsive & Mobile UI Polish

import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaUmbrellaBeach,
  FaChartBar,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaUserShield,
} from "react-icons/fa";

import {
  getCurrentUser,
  logoutUser,
} from "../utils/auth";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Close mobile sidebar whenever route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scrolling while mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  const userRole = currentUser?.role || "Employee";

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <FaUserCircle />,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <FaUsers />,
      roles: ["Admin", "HR"],
    },
    {
      name: "Departments",
      path: "/departments",
      icon: <FaBuilding />,
      roles: ["Admin", "HR"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FaCalendarCheck />,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      name: "Leave Management",
      path: "/leaves",
      icon: <FaUmbrellaBeach />,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartBar />,
      roles: ["Admin", "HR"],
    },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => item.roles.includes(userRole)
  );

  const getPageTitle = () => {
    const currentItem = menuItems.find(
      (item) => location.pathname.startsWith(item.path)
    );

    return currentItem?.name || "Dashboard";
  };

  return (
    <>
      <style>{`
        .ems-layout {
          min-height: 100vh;
          background: #f5f7fb;
        }

        .ems-sidebar {
          width: 260px;
          min-width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1050;
          background: #ffffff;
          border-right: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease;
        }

        .ems-main-wrapper {
          margin-left: 260px;
          min-height: 100vh;
          width: calc(100% - 260px);
        }

        .ems-topbar {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e9ecef;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .ems-content {
          padding: 28px;
        }

        .ems-brand {
          height: 72px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .ems-brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .ems-brand-title {
          font-weight: 700;
          font-size: 18px;
          color: #212529;
          line-height: 1.2;
        }

        .ems-brand-subtitle {
          font-size: 11px;
          color: #6c757d;
        }

        .ems-nav {
          flex: 1;
          overflow-y: auto;
          padding: 18px 12px;
        }

        .ems-nav-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: #8a94a6;
          font-weight: 700;
          padding: 0 12px 10px;
        }

        .ems-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 46px;
          padding: 10px 13px;
          margin-bottom: 5px;
          border-radius: 9px;
          text-decoration: none;
          color: #5c6675;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ems-nav-link:hover {
          background: #f1f5ff;
          color: #0d6efd;
        }

        .ems-nav-link.active {
          background: #eaf2ff;
          color: #0d6efd;
          font-weight: 600;
        }

        .ems-nav-icon {
          width: 20px;
          display: flex;
          justify-content: center;
          font-size: 15px;
        }

        .ems-nav-arrow {
          margin-left: auto;
          font-size: 10px;
          opacity: 0;
        }

        .ems-nav-link:hover .ems-nav-arrow,
        .ems-nav-link.active .ems-nav-arrow {
          opacity: 1;
        }

        .ems-user-box {
          border-top: 1px solid #e9ecef;
          padding: 14px;
        }

        .ems-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: #f8f9fa;
        }

        .ems-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #eaf2ff;
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          flex-shrink: 0;
        }

        .ems-user-info {
          min-width: 0;
          flex: 1;
        }

        .ems-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #212529;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ems-user-role {
          font-size: 11px;
          color: #6c757d;
        }

        .ems-topbar-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
        }

        .ems-mobile-menu-btn {
          display: none;
          border: 0;
          background: transparent;
          color: #495057;
          font-size: 21px;
          padding: 5px 8px;
        }

        .ems-page-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .ems-profile-btn {
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 8px;
          border-radius: 8px;
          color: #495057;
          text-decoration: none;
        }

        .ems-profile-btn:hover {
          background: #f8f9fa;
          color: #0d6efd;
        }

        .ems-profile-icon {
          font-size: 29px;
        }

        .ems-profile-text {
          text-align: left;
        }

        .ems-profile-name {
          font-size: 13px;
          font-weight: 600;
        }

        .ems-profile-role {
          font-size: 11px;
          color: #6c757d;
        }

        .ems-overlay {
          display: none;
        }

        .ems-logout-btn {
          width: 100%;
          border: 0;
          background: transparent;
          color: #dc3545;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          margin-top: 8px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .ems-logout-btn:hover {
          background: #fff1f2;
        }

        @media (max-width: 991.98px) {
          .ems-sidebar {
            transform: translateX(-100%);
          }

          .ems-sidebar.open {
            transform: translateX(0);
          }

          .ems-main-wrapper {
            margin-left: 0;
            width: 100%;
          }

          .ems-mobile-menu-btn {
            display: block;
          }

          .ems-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 1040;
          }

          .ems-content {
            padding: 22px;
          }

          .ems-topbar-inner {
            padding: 0 20px;
          }
        }

        @media (max-width: 575.98px) {
          .ems-topbar {
            height: 64px;
          }

          .ems-topbar-inner {
            padding: 0 12px;
          }

          .ems-content {
            padding: 16px 12px;
          }

          .ems-page-title {
            font-size: 16px;
          }

          .ems-profile-text {
            display: none;
          }

          .ems-profile-icon {
            font-size: 27px;
          }

          .ems-brand {
            height: 64px;
          }

          .ems-sidebar {
            width: 280px;
            min-width: 280px;
          }
        }
      `}</style>

      <div className="ems-layout">

        {/* MOBILE OVERLAY */}

        {sidebarOpen && (
          <div
            className="ems-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}

        <aside
          className={`ems-sidebar ${
            sidebarOpen ? "open" : ""
          }`}
        >

          {/* BRAND */}

          <div className="ems-brand">

            <div className="ems-brand-icon">
              <FaUserShield />
            </div>

            <div>
              <div className="ems-brand-title">
                EmployeeMS
              </div>

              <div className="ems-brand-subtitle">
                Management System
              </div>
            </div>

            {/* MOBILE CLOSE */}

            <button
              type="button"
              className="btn btn-sm d-lg-none ms-auto"
              onClick={() =>
                setSidebarOpen(false)
              }
              aria-label="Close menu"
            >
              <FaTimes />
            </button>

          </div>

          {/* NAVIGATION */}

          <nav className="ems-nav">

            <div className="ems-nav-label">
              Main Menu
            </div>

            {visibleMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `ems-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <span className="ems-nav-icon">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

                <FaChevronRight className="ems-nav-arrow" />

              </NavLink>
            ))}

          </nav>

          {/* USER SECTION */}

          <div className="ems-user-box">

            <div className="ems-user-card">

              <div className="ems-avatar">
                <FaUserCircle />
              </div>

              <div className="ems-user-info">

                <div className="ems-user-name">
                  {currentUser?.name ||
                    "User"}
                </div>

                <div className="ems-user-role">
                  {currentUser?.role ||
                    "Employee"}
                </div>

              </div>

            </div>

            <button
              type="button"
              className="ems-logout-btn"
              onClick={() =>
                setShowLogoutModal(true)
              }
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN */}

        <main className="ems-main-wrapper">

          {/* TOPBAR */}

          <header className="ems-topbar">

            <div className="ems-topbar-inner">

              <div className="d-flex align-items-center gap-2">

                <button
                  type="button"
                  className="ems-mobile-menu-btn"
                  onClick={() =>
                    setSidebarOpen(true)
                  }
                  aria-label="Open menu"
                >
                  <FaBars />
                </button>

                <h1 className="ems-page-title">
                  {getPageTitle()}
                </h1>

              </div>

              <NavLink
                to="/profile"
                className="ems-profile-btn"
              >

                <div className="ems-profile-text">

                  <div className="ems-profile-name">
                    {currentUser?.name ||
                      "User"}
                  </div>

                  <div className="ems-profile-role">
                    {currentUser?.role ||
                      "Employee"}
                  </div>

                </div>

                <FaUserCircle className="ems-profile-icon" />

              </NavLink>

            </div>

          </header>

          {/* PAGE CONTENT */}

          <div className="ems-content">
            {children}
          </div>

        </main>

        {/* LOGOUT CONFIRMATION */}

        {showLogoutModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.55)",
              zIndex: 2000,
            }}
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content border-0 shadow">

                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Confirm Logout
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setShowLogoutModal(false)
                    }
                  />
                </div>

                <div className="modal-body">
                  Are you sure you want to logout
                  from Employee Management System?
                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowLogoutModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default DashboardLayout;