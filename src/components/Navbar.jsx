import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">

      <div className="container-fluid">

        {/* Page Title */}
        <div>
          <h5 className="mb-0 fw-bold">
            Employee Management System
          </h5>

          <small className="text-muted">
            Manage your workforce efficiently
          </small>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-4">

          {/* Search */}
          <div className="input-group d-none d-md-flex">
            <span className="input-group-text bg-light border-0">
              <FaSearch className="text-muted" />
            </span>

            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search..."
            />
          </div>

          {/* Notification */}
          <button
            type="button"
            className="btn btn-light position-relative"
          >
            <FaBell className="text-secondary" />

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "9px" }}
            >
              3
            </span>
          </button>

          {/* User */}
          <div className="d-flex align-items-center gap-2">

            <FaUserCircle
              className="text-primary"
              style={{ fontSize: "35px" }}
            />

            <div className="d-none d-md-block">
              <div className="fw-semibold">
                Admin User
              </div>

              <small className="text-muted">
                Administrator
              </small>
            </div>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;