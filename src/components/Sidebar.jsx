import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaUmbrellaBeach,
  FaChartBar,
  FaUserTie,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <FaUsers />,
    },
    {
      name: "Departments",
      path: "/departments",
      icon: <FaBuilding />,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Leaves",
      path: "/leaves",
      icon: <FaUmbrellaBeach />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartBar />,
    },
  ];

  return (
    <aside
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center mb-4">
        <FaUserTie className="fs-3 me-2" />

        <h4 className="mb-0 fw-bold">
          EmployeeHub
        </h4>
      </div>

      {/* Menu */}
      <nav className="nav flex-column gap-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link text-white d-flex align-items-center gap-3 rounded px-3 py-2 ${
                isActive ? "bg-primary" : ""
              }`
            }
          >
            <span>{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-top border-secondary">
        <small className="text-secondary">
          Employee Management System
        </small>

        <div className="small text-secondary mt-1">
          v1.0.0
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;