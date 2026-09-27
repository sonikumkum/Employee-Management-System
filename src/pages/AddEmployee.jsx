import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSave,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  addEmployee,
  generateEmployeeId,
  getEmployees,
} from "../utils/helpers";

import employeesData from "../data/employees";
import Toast from "../components/Toast";

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Employee name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must contain at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.department) {
      newErrors.department =
        "Please select a department.";
    }

    if (!formData.designation.trim()) {
      newErrors.designation =
        "Designation is required.";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required.";
    }

    if (
      formData.salary === "" ||
      Number(formData.salary) < 0
    ) {
      newErrors.salary =
        "Please enter a valid salary.";
    }

    if (!formData.status) {
      newErrors.status =
        "Please select employee status.";
    }

    /* Duplicate email check */

    const employees =
      getEmployees(employeesData);

    const emailExists = employees.some(
      (employee) =>
        employee.email?.toLowerCase() ===
        formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      newErrors.email =
        "An employee with this email already exists.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showToast(
        "Please fix the highlighted fields.",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeId =
        generateEmployeeId();

      const newEmployee = {
        id: employeeId,
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone.trim(),
        department: formData.department,
        designation:
          formData.designation.trim(),
        joiningDate: formData.joiningDate,
        salary: Number(formData.salary),
        status: formData.status,
        attendance: "Present",
      };

      addEmployee(newEmployee);

      showToast(
        `${newEmployee.name} added successfully.`,
        "success"
      );

      setTimeout(() => {
        navigate("/employees");
      }, 1200);
    } catch (error) {
      console.error(
        "Error adding employee:",
        error
      );

      showToast(
        "Unable to add employee. Please try again.",
        "error"
      );

      setIsSubmitting(false);
    }
  };

  /* =====================================================
     DEPARTMENTS
  ===================================================== */

  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
  ];

  return (
    <div>

      {/* TOAST */}

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

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Add New Employee
          </h2>

          <p className="text-muted mb-0">
            Create a new employee profile.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/employees")}
        >
          <FaArrowLeft className="me-2" />
          Back to Employees
        </button>

      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit}>

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-header bg-white p-4">

            <div className="d-flex align-items-center gap-2">

              <div className="text-primary">
                <FaUserPlus size={22} />
              </div>

              <div>
                <h5 className="fw-bold mb-0">
                  Personal Information
                </h5>

                <small className="text-muted">
                  Basic employee details
                </small>
              </div>

            </div>

          </div>

          <div className="card-body p-4">

            <div className="row g-4">

              {/* NAME */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Full Name{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaUser />
                  </span>

                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                {errors.name && (
                  <div className="text-danger small mt-1">
                    {errors.name}
                  </div>
                )}

              </div>

              {/* EMAIL */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Email Address{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>

                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="employee@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                {errors.email && (
                  <div className="text-danger small mt-1">
                    {errors.email}
                  </div>
                )}

              </div>

              {/* PHONE */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Phone Number{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaPhone />
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    className={`form-control ${
                      errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

                {errors.phone && (
                  <div className="text-danger small mt-1">
                    {errors.phone}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* PROFESSIONAL INFORMATION */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-header bg-white p-4">

            <div className="d-flex align-items-center gap-2">

              <div className="text-primary">
                <FaBriefcase size={22} />
              </div>

              <div>
                <h5 className="fw-bold mb-0">
                  Professional Information
                </h5>

                <small className="text-muted">
                  Employment details
                </small>
              </div>

            </div>

          </div>

          <div className="card-body p-4">

            <div className="row g-4">

              {/* DEPARTMENT */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Department{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaBuilding />
                  </span>

                  <select
                    name="department"
                    className={`form-select ${
                      errors.department
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.department}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {errors.department && (
                  <div className="text-danger small mt-1">
                    {errors.department}
                  </div>
                )}

              </div>

              {/* DESIGNATION */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Designation{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaBriefcase />
                  </span>

                  <input
                    type="text"
                    name="designation"
                    className={`form-control ${
                      errors.designation
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="e.g. Software Developer"
                    value={formData.designation}
                    onChange={handleChange}
                  />

                </div>

                {errors.designation && (
                  <div className="text-danger small mt-1">
                    {errors.designation}
                  </div>
                )}

              </div>

              {/* JOINING DATE */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Joining Date{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>

                  <input
                    type="date"
                    name="joiningDate"
                    className={`form-control ${
                      errors.joiningDate
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />

                </div>

                {errors.joiningDate && (
                  <div className="text-danger small mt-1">
                    {errors.joiningDate}
                  </div>
                )}

              </div>

              {/* SALARY */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Salary{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaMoneyBillWave />
                  </span>

                  <input
                    type="number"
                    name="salary"
                    min="0"
                    className={`form-control ${
                      errors.salary
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={handleChange}
                  />

                </div>

                {errors.salary && (
                  <div className="text-danger small mt-1">
                    {errors.salary}
                  </div>
                )}

              </div>

              {/* STATUS */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Status{" "}
                  <span className="text-danger">
                    *
                  </span>
                </label>

                <select
                  name="status"
                  className={`form-select ${
                    errors.status
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

                {errors.status && (
                  <div className="text-danger small mt-1">
                    {errors.status}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">

              <button
                type="button"
                className="btn btn-light px-4"
                onClick={() =>
                  navigate("/employees")
                }
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Employee
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
}

export default AddEmployee;