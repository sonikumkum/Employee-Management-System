import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaIdBadge,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
} from "react-icons/fa";

import {
  getEmployeeById,
  deleteEmployee,
} from "../utils/helpers";

import Toast from "../components/Toast";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  /* =====================================================
     LOAD EMPLOYEE
  ===================================================== */

  useEffect(() => {
    const loadEmployee = () => {
      setLoading(true);

      const existingEmployee =
        getEmployeeById(id);

      setEmployee(existingEmployee || null);

      setLoading(false);
    };

    loadEmployee();
  }, [id]);

  /* =====================================================
     TOAST
  ===================================================== */

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);
  };

  /* =====================================================
     DELETE EMPLOYEE
  ===================================================== */

  const handleDelete = () => {
    if (!employee) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.name} (${employee.id})?`
    );

    if (!confirmDelete) return;

    try {
      deleteEmployee(employee.id);

      showToast(
        `${employee.name} has been deleted successfully.`,
        "success"
      );

      setTimeout(() => {
        navigate("/employees");
      }, 1000);
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error
      );

      showToast(
        "Unable to delete employee. Please try again.",
        "error"
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div>

        <div className="d-flex flex-column align-items-center justify-content-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <div className="text-muted mt-3">
            Loading employee profile...
          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!employee) {
    return (
      <div>

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <div
              className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "75px",
                height: "75px",
              }}
            >
              <FaTimesCircle size={34} />
            </div>

            <h4 className="fw-bold">
              Employee Not Found
            </h4>

            <p className="text-muted">
              The employee you're looking for does
              not exist or may have been deleted.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/employees")
              }
            >
              <FaArrowLeft className="me-2" />
              Back to Employees
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div>

      {/* ================= TOAST ================= */}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      {/* ================= HEADER ================= */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>

          <button
            type="button"
            className="btn btn-link text-decoration-none p-0 mb-2"
            onClick={() =>
              navigate("/employees")
            }
          >
            <FaArrowLeft className="me-2" />
            Back to Employees
          </button>

          <h2 className="fw-bold mb-1">
            Employee Profile
          </h2>

          <p className="text-muted mb-0">
            View complete employee information.
          </p>

        </div>

        <div className="d-flex gap-2">

          <Link
            to={`/employees/edit/${employee.id}`}
            className="btn btn-warning"
          >
            <FaEdit className="me-2" />
            Edit
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleDelete}
          >
            <FaTrash className="me-2" />
            Delete
          </button>

        </div>

      </div>

      {/* ================= PROFILE HEADER ================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="row align-items-center">

            <div className="col-md-8">

              <div className="d-flex align-items-center gap-4">

                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "90px",
                    height: "90px",
                    flexShrink: 0,
                  }}
                >
                  <FaUserCircle size={52} />
                </div>

                <div>

                  <h3 className="fw-bold mb-1">
                    {employee.name}
                  </h3>

                  <div className="text-muted mb-2">
                    {employee.designation}
                  </div>

                  <div className="d-flex flex-wrap gap-2">

                    <span className="badge bg-primary-subtle text-primary">
                      <FaIdBadge className="me-1" />
                      {employee.id}
                    </span>

                    <span
                      className={`badge ${
                        employee.status ===
                        "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {employee.status ===
                      "Active" ? (
                        <FaCheckCircle className="me-1" />
                      ) : (
                        <FaTimesCircle className="me-1" />
                      )}

                      {employee.status}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-md-4 mt-4 mt-md-0">

              <div className="bg-light rounded-3 p-3">

                <div className="small text-muted">
                  Department
                </div>

                <div className="fw-bold mt-1">
                  <FaBuilding className="text-primary me-2" />
                  {employee.department}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTACT INFORMATION ================= */}

      <div className="row g-4 mb-4">

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-header bg-white border-0 p-4">

              <h5 className="fw-bold mb-1">
                Contact Information
              </h5>

              <small className="text-muted">
                Employee contact details
              </small>

            </div>

            <div className="card-body">

              <DetailItem
                icon={<FaEnvelope />}
                label="Email Address"
                value={employee.email}
              />

              <DetailItem
                icon={<FaPhone />}
                label="Phone Number"
                value={employee.phone}
              />

            </div>

          </div>

        </div>

        {/* ================= PROFESSIONAL INFO ================= */}

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-header bg-white border-0 p-4">

              <h5 className="fw-bold mb-1">
                Professional Information
              </h5>

              <small className="text-muted">
                Current employment details
              </small>

            </div>

            <div className="card-body">

              <DetailItem
                icon={<FaBuilding />}
                label="Department"
                value={employee.department}
              />

              <DetailItem
                icon={<FaBriefcase />}
                label="Designation"
                value={employee.designation}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= EMPLOYMENT DETAILS ================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 p-4">

          <h5 className="fw-bold mb-1">
            Employment Details
          </h5>

          <small className="text-muted">
            Joining date, salary and current status
          </small>

        </div>

        <div className="card-body">

          <div className="row g-4">

            <div className="col-md-4">

              <InfoBox
                icon={<FaIdBadge />}
                label="Employee ID"
                value={employee.id}
                color="primary"
              />

            </div>

            <div className="col-md-4">

              <InfoBox
                icon={<FaCalendarAlt />}
                label="Joining Date"
                value={
                  employee.joiningDate
                    ? new Date(
                        `${employee.joiningDate}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "-"
                }
                color="info"
              />

            </div>

            <div className="col-md-4">

              <InfoBox
                icon={<FaMoneyBillWave />}
                label="Salary"
                value={
                  employee.salary !==
                    undefined &&
                  employee.salary !== null
                    ? `₹${Number(
                        employee.salary
                      ).toLocaleString("en-IN")}`
                    : "-"
                }
                color="success"
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= ATTENDANCE ================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="fw-bold mb-1">
                Attendance
              </h5>

              <small className="text-muted">
                Current attendance status
              </small>

            </div>

            <FaCalendarCheck
              className="text-primary"
              size={24}
            />

          </div>

        </div>

        <div className="card-body">

          <div className="row align-items-center">

            <div className="col-md-6">

              <div className="d-flex align-items-center gap-3">

                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${
                    employee.attendance ===
                    "Present"
                      ? "bg-success-subtle text-success"
                      : "bg-warning-subtle text-warning"
                  }`}
                  style={{
                    width: "55px",
                    height: "55px",
                  }}
                >
                  <FaCalendarCheck size={24} />
                </div>

                <div>

                  <div className="small text-muted">
                    Current Status
                  </div>

                  <h5 className="fw-bold mb-0">
                    {employee.attendance ||
                      "Not Marked"}
                  </h5>

                </div>

              </div>

            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">

              <Link
                to="/attendance"
                className="btn btn-outline-primary"
              >
                <FaCalendarCheck className="me-2" />
                View Attendance
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ACTIONS ================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">

            <div>

              <h5 className="fw-bold mb-1">
                Manage Employee
              </h5>

              <small className="text-muted">
                Update or remove this employee
                profile.
              </small>

            </div>

            <div className="d-flex gap-2">

              <Link
                to={`/employees/edit/${employee.id}`}
                className="btn btn-warning"
              >
                <FaEdit className="me-2" />
                Edit Employee
              </Link>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleDelete}
              >
                <FaTrash className="me-2" />
                Delete
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="d-flex align-items-center gap-3 border-bottom py-3">

      <div
        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: "42px",
          height: "42px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div className="min-width-0">

        <div className="small text-muted">
          {label}
        </div>

        <div className="fw-semibold text-break">
          {value || "-"}
        </div>

      </div>

    </div>
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  icon,
  label,
  value,
  color,
}) {
  return (
    <div className="bg-light rounded-3 p-3 h-100">

      <div
        className={`text-${color} mb-2`}
        style={{ fontSize: "22px" }}
      >
        {icon}
      </div>

      <div className="small text-muted">
        {label}
      </div>

      <div className="fw-bold mt-1 text-break">
        {value || "-"}
      </div>

    </div>
  );
}

export default EmployeeDetails;