// Employee Management System - Profile Management

import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEdit,
  FaSave,
  FaTimes,
  FaIdBadge,
} from "react-icons/fa";

import {
  getCurrentUser,
} from "../utils/auth";

import {
  getEmployees,
  updateEmployee,
} from "../utils/helpers";

import employeesData from "../data/employees";

function Profile() {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [employee, setEmployee] =
    useState(null);

  const [employees, setEmployees] =
    useState([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      salary: "",
    });

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const user = getCurrentUser();

    setCurrentUser(user);

    const storedEmployees =
      getEmployees(employeesData);

    setEmployees(storedEmployees);

    if (user?.employeeId) {
      const loggedInEmployee =
        storedEmployees.find(
          (item) =>
            item.id ===
            user.employeeId
        );

      if (loggedInEmployee) {
        setEmployee(
          loggedInEmployee
        );

        setFormData({
          name:
            loggedInEmployee.name ||
            "",
          email:
            loggedInEmployee.email ||
            "",
          phone:
            loggedInEmployee.phone ||
            "",
          department:
            loggedInEmployee.department ||
            "",
          designation:
            loggedInEmployee.designation ||
            "",
          joiningDate:
            loggedInEmployee.joiningDate ||
            "",
          salary:
            loggedInEmployee.salary ||
            "",
        });
      }
    }
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!employee) {
      setError(
        "Employee profile not found."
      );

      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError(
        "Name, email and phone are required."
      );

      return;
    }

    const emailExists =
      employees.some(
        (item) =>
          item.id !== employee.id &&
          item.email.toLowerCase() ===
            formData.email
              .trim()
              .toLowerCase()
      );

    if (emailExists) {
      setError(
        "This email is already used by another employee."
      );

      return;
    }

    const updatedEmployee = {
      name:
        formData.name.trim(),

      email:
        formData.email
          .trim()
          .toLowerCase(),

      phone:
        formData.phone.trim(),

      department:
        employee.department,

      designation:
        employee.designation,

      joiningDate:
        employee.joiningDate,

      salary:
        employee.salary,

      status:
        employee.status,

      attendance:
        employee.attendance,
    };

    const updatedEmployees =
      updateEmployee(
        employee.id,
        updatedEmployee
      );

    setEmployees(
      updatedEmployees
    );

    const updatedProfile =
      updatedEmployees.find(
        (item) =>
          item.id === employee.id
      );

    setEmployee(
      updatedProfile
    );

    // Update logged-in user's name/email
    // so navbar also shows updated information
    const updatedUser = {
      ...currentUser,
      name:
        updatedProfile.name,
      email:
        updatedProfile.email,
    };

    localStorage.setItem(
      "employee_management_system_current_user",
      JSON.stringify(updatedUser)
    );

    setCurrentUser(
      updatedUser
    );

    setIsEditing(false);

    setSuccess(
      "Profile updated successfully."
    );

    setTimeout(
      () => setSuccess(""),
      2000
    );
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    if (!employee) {
      return;
    }

    setFormData({
      name:
        employee.name || "",
      email:
        employee.email || "",
      phone:
        employee.phone || "",
      department:
        employee.department || "",
      designation:
        employee.designation || "",
      joiningDate:
        employee.joiningDate || "",
      salary:
        employee.salary || "",
    });

    setError("");
    setIsEditing(false);
  };

  // =====================================================
  // ADMIN / HR PROFILE
  // =====================================================

  if (
    currentUser &&
    !currentUser.employeeId
  ) {
    return (
      <div className="container-fluid">

        <div className="mb-4">

          <h2 className="fw-bold mb-1">
            My Profile
          </h2>

          <p className="text-muted mb-0">
            View your account information.
          </p>

        </div>

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4">

              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "90px",
                  height: "90px",
                }}
              >
                <FaUserCircle size={55} />
              </div>

              <div>

                <h3 className="fw-bold mb-1">
                  {currentUser.name}
                </h3>

                <p className="text-muted mb-2">
                  {currentUser.email}
                </p>

                <span className="badge bg-primary">
                  {currentUser.role}
                </span>

              </div>

            </div>

            <div className="row g-4">

              <ProfileInfo
                icon={<FaIdBadge />}
                label="User ID"
                value={
                  currentUser.id
                }
              />

              <ProfileInfo
                icon={<FaEnvelope />}
                label="Email"
                value={
                  currentUser.email
                }
              />

              <ProfileInfo
                icon={<FaBriefcase />}
                label="Role"
                value={
                  currentUser.role
                }
              />

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // EMPLOYEE PROFILE NOT FOUND
  // =====================================================

  if (!employee) {
    return (
      <div className="container-fluid">

        <div className="alert alert-warning">
          Employee profile could not be found.
        </div>

      </div>
    );
  }

  // =====================================================
  // EMPLOYEE PROFILE
  // =====================================================

  return (
    <div className="container-fluid">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            My Profile
          </h2>

          <p className="text-muted mb-0">
            View and manage your employee profile.
          </p>

        </div>

        {!isEditing ? (

          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() =>
              setIsEditing(true)
            }
          >
            <FaEdit />
            Edit Profile
          </button>

        ) : (

          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handleCancel}
          >
            <FaTimes />
            Cancel
          </button>

        )}

      </div>


      {/* =================================================
          ALERTS
          ================================================= */}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {/* =================================================
          PROFILE HEADER
          ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">

            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "90px",
                height: "90px",
                fontSize: "32px",
              }}
            >
              {employee.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="flex-grow-1">

              <h3 className="fw-bold mb-1">
                {employee.name}
              </h3>

              <p className="text-muted mb-2">
                {employee.designation}
              </p>

              <div className="d-flex flex-wrap gap-2">

                <span className="badge bg-primary">
                  {employee.id}
                </span>

                <span
                  className={`badge ${
                    employee.status ===
                    "Active"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {employee.status}
                </span>

                <span className="badge bg-secondary">
                  {currentUser?.role}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          PROFILE FORM
          ================================================= */}

      <form onSubmit={handleSave}>

        <div className="row g-4">

          {/* Personal Information */}

          <div className="col-12 col-lg-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Personal Information
                </h5>


                {/* Name */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  {isEditing ? (

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <div className="form-control bg-light">
                      {employee.name}
                    </div>

                  )}

                </div>


                {/* Email */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  {isEditing ? (

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <div className="form-control bg-light d-flex align-items-center gap-2">
                      <FaEnvelope className="text-muted" />
                      {employee.email}
                    </div>

                  )}

                </div>


                {/* Phone */}

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  {isEditing ? (

                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <div className="form-control bg-light d-flex align-items-center gap-2">
                      <FaPhone className="text-muted" />
                      {employee.phone ||
                        "Not provided"}
                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* Professional Information */}

          <div className="col-12 col-lg-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Professional Information
                </h5>


                {/* Employee ID */}

                <ProfileInfo
                  icon={<FaIdBadge />}
                  label="Employee ID"
                  value={
                    employee.id
                  }
                />


                {/* Department */}

                <ProfileInfo
                  icon={<FaBuilding />}
                  label="Department"
                  value={
                    employee.department
                  }
                />


                {/* Designation */}

                <ProfileInfo
                  icon={<FaBriefcase />}
                  label="Designation"
                  value={
                    employee.designation
                  }
                />


                {/* Joining Date */}

                <ProfileInfo
                  icon={<FaCalendarAlt />}
                  label="Joining Date"
                  value={
                    employee.joiningDate
                  }
                />


                {/* Salary */}

                <ProfileInfo
                  icon={<FaMoneyBillWave />}
                  label="Salary"
                  value={
                    employee.salary
                      ? `₹${Number(
                          employee.salary
                        ).toLocaleString(
                          "en-IN"
                        )}`
                      : "Not provided"
                  }
                />

              </div>

            </div>

          </div>


          {/* Save Button */}

          {isEditing && (
            <div className="col-12">

              <div className="d-flex justify-content-end gap-2">

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    handleCancel
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>

              </div>

            </div>
          )}

        </div>

      </form>

    </div>
  );
}


// =======================================================
// PROFILE INFO
// =======================================================

function ProfileInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="d-flex align-items-center mb-3">

      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 me-3">
        {icon}
      </div>

      <div>

        <small className="text-muted d-block">
          {label}
        </small>

        <span className="fw-semibold">
          {value}
        </span>

      </div>

    </div>
  );
}

export default Profile;