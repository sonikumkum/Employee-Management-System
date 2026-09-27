// STEP 46: Premium Employees Management UI

import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaExclamationTriangle,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { getEmployees, deleteEmployee } from "../utils/helpers";
import employeesData from "../data/employees";
import Toast from "../components/Toast";
import EmptyState from "../components/EmptyState";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedEmployees = getEmployees(employeesData);
      setEmployees(storedEmployees);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast((previous) => ({
        ...previous,
        show: false,
      }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ].sort();
  }, [employees]);

  const designations = useMemo(() => {
    return [
      ...new Set(
        employees
          .map((employee) => employee.designation)
          .filter(Boolean)
      ),
    ].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !search ||
        employee.name?.toLowerCase().includes(search) ||
        employee.id?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search);

      const matchesDepartment =
        !departmentFilter ||
        employee.department === departmentFilter;

      const matchesStatus =
        !statusFilter ||
        employee.status === statusFilter;

      const matchesDesignation =
        !designationFilter ||
        employee.designation === designationFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesDesignation
      );
    });
  }, [
    employees,
    searchTerm,
    departmentFilter,
    statusFilter,
    designationFilter,
  ]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status?.toLowerCase() === "active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) =>
      employee.status?.toLowerCase() === "inactive"
  ).length;

  const departmentCount = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ).size;

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("");
    setDesignationFilter("");
  };

  const hasFilters =
    searchTerm ||
    departmentFilter ||
    statusFilter ||
    designationFilter;

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedEmployee) return;

    try {
      const updatedEmployees = deleteEmployee(
        selectedEmployee.id
      );

      setEmployees(updatedEmployees);

      setShowDeleteModal(false);

      setToast({
        show: true,
        message: `${selectedEmployee.name} has been deleted successfully.`,
        type: "success",
      });

      setSelectedEmployee(null);
    } catch (error) {
      console.error("Delete employee error:", error);

      setToast({
        show: true,
        message: "Unable to delete employee.",
        type: "error",
      });
    }
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #6366F1, #8B5CF6)",
      "linear-gradient(135deg, #06B6D4, #3B82F6)",
      "linear-gradient(135deg, #8B5CF6, #EC4899)",
      "linear-gradient(135deg, #10B981, #14B8A6)",
      "linear-gradient(135deg, #F59E0B, #EF4444)",
    ];

    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="employees-page">
        <style>
          {`
            .employees-loading {
              min-height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              animation: pageFadeIn 0.5s ease;
            }

            .employees-loader {
              width: 52px;
              height: 52px;
              border: 4px solid #E0E7FF;
              border-top-color: #6366F1;
              border-radius: 50%;
              animation: employeeSpin 0.8s linear infinite;
            }

            @keyframes employeeSpin {
              to {
                transform: rotate(360deg);
              }
            }

            @keyframes pageFadeIn {
              from {
                opacity: 0;
                transform: translateY(15px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        <div className="employees-loading">
          <div className="employees-loader"></div>

          <div
            className="mt-3 fw-semibold"
            style={{ color: "#6366F1" }}
          >
            Loading employees...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-page">
      <style>
        {`
          .employees-page {
            animation: employeePageIn 0.55s ease;
            color: #172033;
          }

          @keyframes employeePageIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .employee-hero {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            padding: 28px;
            color: white;
            background:
              radial-gradient(
                circle at 85% 20%,
                rgba(255,255,255,0.18),
                transparent 25%
              ),
              linear-gradient(
                135deg,
                #4F46E5 0%,
                #6366F1 45%,
                #8B5CF6 100%
              );
            box-shadow:
              0 18px 45px rgba(79, 70, 229, 0.20);
          }

          .employee-hero::before {
            content: "";
            position: absolute;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            right: -55px;
            top: -80px;
            animation: heroFloat 5s ease-in-out infinite;
          }

          .employee-hero::after {
            content: "";
            position: absolute;
            width: 110px;
            height: 110px;
            border-radius: 50%;
            background: rgba(255,255,255,0.06);
            right: 120px;
            bottom: -65px;
            animation: heroFloat 4s ease-in-out infinite reverse;
          }

          @keyframes heroFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(12px);
            }
          }

          .hero-content {
            position: relative;
            z-index: 2;
          }

          .hero-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: rgba(255,255,255,0.16);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: inset 0 1px rgba(255,255,255,0.2);
          }

          .add-employee-btn {
            border: 0;
            border-radius: 13px;
            background: white;
            color: #4F46E5;
            font-weight: 700;
            padding: 11px 18px;
            transition: all 0.25s ease;
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          }

          .add-employee-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.18);
            color: #4338CA;
          }

          .stat-card {
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            background: white;
            padding: 20px;
            height: 100%;
            position: relative;
            overflow: hidden;
            transition:
              transform 0.28s ease,
              box-shadow 0.28s ease,
              border-color 0.28s ease;
            animation: cardAppear 0.5s ease backwards;
          }

          .stat-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 18px 35px rgba(31, 41, 55, 0.10);
            border-color: #E0E7FF;
          }

          .stat-card:nth-child(1) {
            animation-delay: 0.05s;
          }

          .stat-card:nth-child(2) {
            animation-delay: 0.1s;
          }

          .stat-card:nth-child(3) {
            animation-delay: 0.15s;
          }

          .stat-card:nth-child(4) {
            animation-delay: 0.2s;
          }

          @keyframes cardAppear {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .stat-icon.blue {
            background: #EEF2FF;
            color: #6366F1;
          }

          .stat-icon.green {
            background: #ECFDF5;
            color: #10B981;
          }

          .stat-icon.red {
            background: #FEF2F2;
            color: #EF4444;
          }

          .stat-icon.purple {
            background: #F5F3FF;
            color: #8B5CF6;
          }

          .filter-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(31, 41, 55, 0.04);
            animation: cardAppear 0.55s ease 0.15s backwards;
          }

          .filter-label {
            font-size: 12px;
            font-weight: 700;
            color: #6B7280;
            margin-bottom: 7px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .modern-input,
          .modern-select {
            border: 1px solid #E5E7EB !important;
            border-radius: 12px !important;
            min-height: 45px;
            box-shadow: none !important;
            transition: all 0.2s ease;
          }

          .modern-input:focus,
          .modern-select:focus {
            border-color: #818CF8 !important;
            box-shadow: 0 0 0 4px rgba(99,102,241,0.10) !important;
          }

          .search-wrapper {
            position: relative;
          }

          .search-wrapper .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #9CA3AF;
            z-index: 2;
          }

          .search-wrapper input {
            padding-left: 42px;
          }

          .clear-filter-btn {
            border: 0;
            background: #F5F3FF;
            color: #6366F1;
            border-radius: 11px;
            font-weight: 600;
            padding: 9px 14px;
            transition: all 0.2s ease;
          }

          .clear-filter-btn:hover {
            background: #EDE9FE;
            transform: translateY(-2px);
          }

          .employee-table-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(31, 41, 55, 0.05);
            animation: cardAppear 0.6s ease 0.2s backwards;
          }

          .table-header {
            padding: 20px 22px;
            border-bottom: 1px solid #F0F1F6;
          }

          .employee-table {
            margin: 0;
            vertical-align: middle;
          }

          .employee-table thead th {
            background: #FAFAFD;
            border-bottom: 1px solid #EEF0F7;
            color: #6B7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 800;
            padding: 15px 18px;
            white-space: nowrap;
          }

          .employee-table tbody tr {
            transition:
              background 0.22s ease,
              transform 0.22s ease;
          }

          .employee-table tbody tr:hover {
            background: #F8F9FF;
          }

          .employee-table tbody td {
            padding: 16px 18px;
            border-color: #F1F2F6;
          }

          .employee-avatar {
            width: 44px;
            height: 44px;
            min-width: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 13px;
            box-shadow: 0 7px 16px rgba(79,70,229,0.16);
          }

          .employee-name {
            font-weight: 700;
            color: #1F2937;
          }

          .employee-id {
            font-size: 11px;
            font-weight: 700;
            color: #818CF8;
          }

          .employee-email {
            font-size: 12px;
            color: #6B7280;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
          }

          .status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            animation: statusPulse 1.8s ease-in-out infinite;
          }

          .status-active {
            background: #ECFDF5;
            color: #047857;
          }

          .status-active .status-dot {
            background: #10B981;
          }

          .status-inactive {
            background: #FEF2F2;
            color: #B91C1C;
          }

          .status-inactive .status-dot {
            background: #EF4444;
            animation: none;
          }

          @keyframes statusPulse {
            0%, 100% {
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(16,185,129,0.35);
            }
            50% {
              opacity: 0.7;
              box-shadow: 0 0 0 5px rgba(16,185,129,0);
            }
          }

          .action-btn {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid #EDEEF4;
            background: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .action-btn:hover {
            transform: translateY(-3px);
          }

          .view-btn {
            color: #6366F1;
          }

          .view-btn:hover {
            background: #EEF2FF;
            border-color: #C7D2FE;
          }

          .edit-btn {
            color: #0EA5E9;
          }

          .edit-btn:hover {
            background: #F0F9FF;
            border-color: #BAE6FD;
          }

          .delete-btn {
            color: #EF4444;
          }

          .delete-btn:hover {
            background: #FEF2F2;
            border-color: #FECACA;
          }

          .results-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            background: #F5F3FF;
            color: #6366F1;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
          }

          .empty-wrapper {
            padding: 55px 20px;
          }

          .delete-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(15, 23, 42, 0.58);
            backdrop-filter: blur(7px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: modalFade 0.2s ease;
          }

          .delete-modal {
            width: 100%;
            max-width: 430px;
            background: white;
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 30px 80px rgba(15,23,42,0.25);
            animation: modalUp 0.3s ease;
          }

          @keyframes modalFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalUp {
            from {
              opacity: 0;
              transform: translateY(25px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .warning-icon {
            width: 62px;
            height: 62px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FEF2F2;
            color: #EF4444;
            margin: 0 auto 18px;
          }

          .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 34px;
            height: 34px;
            border: 0;
            border-radius: 10px;
            background: #F8FAFC;
            color: #64748B;
          }

          .modal-close:hover {
            background: #F1F5F9;
          }

          .modal-delete-btn {
            border: 0;
            border-radius: 12px;
            padding: 11px 18px;
            background: #EF4444;
            color: white;
            font-weight: 700;
            transition: all 0.2s ease;
          }

          .modal-delete-btn:hover {
            background: #DC2626;
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(239,68,68,0.25);
          }

          .modal-cancel-btn {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 10px 18px;
            background: white;
            color: #374151;
            font-weight: 700;
          }

          .modal-cancel-btn:hover {
            background: #F9FAFB;
          }

          @media (max-width: 767px) {
            .employee-hero {
              padding: 22px;
              border-radius: 20px;
            }

            .employee-hero .d-flex {
              align-items: flex-start !important;
            }

            .add-employee-btn {
              padding: 9px 12px;
              font-size: 12px;
            }

            .hero-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
            }

            .employee-hero h1 {
              font-size: 23px !important;
            }

            .filter-card {
              padding: 16px;
              border-radius: 18px;
            }

            .employee-table-card {
              border-radius: 18px;
            }

            .table-header {
              padding: 17px;
            }

            .employee-table-wrapper {
              overflow-x: auto;
            }

            .employee-table {
              min-width: 850px;
            }

            .stat-card {
              padding: 16px;
            }

            .delete-modal {
              padding: 23px;
              border-radius: 20px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast((previous) => ({
              ...previous,
              show: false,
            }))
          }
        />
      )}

      {/* HERO */}
      <div className="employee-hero mb-4">
        <div className="hero-content">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="hero-icon">
                <FaUsers size={25} />
              </div>

              <div>
                <div
                  className="small mb-1"
                  style={{
                    color: "rgba(255,255,255,0.78)",
                    fontWeight: 600,
                  }}
                >
                  Workforce Management
                </div>

                <h1
                  className="fw-bold mb-1"
                  style={{ fontSize: "30px" }}
                >
                  Employees
                </h1>

                <p
                  className="mb-0"
                  style={{
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "14px",
                  }}
                >
                  Manage your organization's employees
                  efficiently.
                </p>
              </div>
            </div>

            <Link
              to="/employees/add"
              className="add-employee-btn text-decoration-none d-flex align-items-center gap-2"
            >
              <FaPlus size={12} />
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div
                  className="text-muted small fw-semibold mb-2"
                >
                  Total Employees
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#1F2937",
                  }}
                >
                  {totalEmployees}
                </div>

                <div className="small text-muted mt-1">
                  Workforce size
                </div>
              </div>

              <div className="stat-icon blue">
                <FaUsers size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div
                  className="text-muted small fw-semibold mb-2"
                >
                  Active Employees
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#059669",
                  }}
                >
                  {activeEmployees}
                </div>

                <div className="small text-muted mt-1">
                  Currently active
                </div>
              </div>

              <div className="stat-icon green">
                <FaUserCheck size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div
                  className="text-muted small fw-semibold mb-2"
                >
                  Inactive Employees
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#DC2626",
                  }}
                >
                  {inactiveEmployees}
                </div>

                <div className="small text-muted mt-1">
                  Currently inactive
                </div>
              </div>

              <div className="stat-icon red">
                <FaUserTimes size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div
                  className="text-muted small fw-semibold mb-2"
                >
                  Departments
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#7C3AED",
                  }}
                >
                  {departmentCount}
                </div>

                <div className="small text-muted mt-1">
                  Across organization
                </div>
              </div>

              <div className="stat-icon purple">
                <FaBriefcase size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-card mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: 10,
                background: "#EEF2FF",
                color: "#6366F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaFilter size={14} />
            </div>

            <div>
              <div className="fw-bold">
                Search & Filters
              </div>

              <div
                className="small text-muted"
                style={{ fontSize: "11px" }}
              >
                Find employees quickly
              </div>
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="clear-filter-btn d-flex align-items-center gap-2"
              onClick={clearFilters}
            >
              <FaTimes size={11} />
              Clear
            </button>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <label className="filter-label">
              Search Employee
            </label>

            <div className="search-wrapper">
              <FaSearch className="search-icon" />

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Search by name, ID or email..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          <div className="col-12 col-sm-4 col-lg-2.5">
            <label className="filter-label">
              Department
            </label>

            <select
              className="form-select modern-select"
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
            >
              <option value="">All Departments</option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-sm-4 col-lg-2">
            <label className="filter-label">
              Status
            </label>

            <select
              className="form-select modern-select"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-12 col-sm-4 col-lg-2.5">
            <label className="filter-label">
              Designation
            </label>

            <select
              className="form-select modern-select"
              value={designationFilter}
              onChange={(event) =>
                setDesignationFilter(event.target.value)
              }
            >
              <option value="">All Designations</option>

              {designations.map((designation) => (
                <option
                  key={designation}
                  value={designation}
                >
                  {designation}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="employee-table-card">
        <div className="table-header">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">
                Employee Directory
              </h5>

              <div className="small text-muted">
                View and manage all employees
              </div>
            </div>

            <div className="results-pill">
              <FaUsers size={11} />
              {filteredEmployees.length} Results
            </div>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="empty-wrapper">
            <EmptyState
              title={
                hasFilters
                  ? "No employees found"
                  : "No employees available"
              }
              message={
                hasFilters
                  ? "Try changing your search or filter criteria."
                  : "Add your first employee to get started."
              }
              actionText={
                hasFilters ? "Clear Filters" : "Add Employee"
              }
              onAction={
                hasFilters
                  ? clearFilters
                  : () => navigate("/employees/add")
              }
            />
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="table employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map(
                  (employee, index) => {
                    const isActive =
                      employee.status?.toLowerCase() ===
                      "active";

                    return (
                      <tr key={employee.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="employee-avatar"
                              style={{
                                background:
                                  getAvatarGradient(index),
                              }}
                            >
                              {getInitials(
                                employee.name
                              )}
                            </div>

                            <div>
                              <div className="employee-name">
                                {employee.name}
                              </div>

                              <div className="employee-id">
                                {employee.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="employee-email d-flex align-items-center gap-2 mb-1">
                            <FaEnvelope
                              size={10}
                              style={{
                                color: "#818CF8",
                              }}
                            />

                            {employee.email}
                          </div>

                          {employee.phone && (
                            <div className="employee-email d-flex align-items-center gap-2">
                              <FaPhone
                                size={9}
                                style={{
                                  color: "#94A3B8",
                                }}
                              />

                              {employee.phone}
                            </div>
                          )}
                        </td>

                        <td>
                          <span
                            className="fw-semibold"
                            style={{
                              fontSize: "13px",
                            }}
                          >
                            {employee.department ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className="text-muted"
                            style={{
                              fontSize: "13px",
                            }}
                          >
                            {employee.designation ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              isActive
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            <span className="status-dot"></span>

                            {employee.status ||
                              "Inactive"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              to={`/employees/${employee.id}`}
                              className="action-btn view-btn"
                              title="View Employee"
                            >
                              <FaEye size={13} />
                            </Link>

                            <Link
                              to={`/employees/edit/${employee.id}`}
                              className="action-btn edit-btn"
                              title="Edit Employee"
                            >
                              <FaEdit size={13} />
                            </Link>

                            <button
                              type="button"
                              className="action-btn delete-btn"
                              title="Delete Employee"
                              onClick={() =>
                                handleDeleteClick(
                                  employee
                                )
                              }
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && selectedEmployee && (
        <div
          className="delete-overlay"
          onClick={() =>
            setShowDeleteModal(false)
          }
        >
          <div
            className="delete-modal position-relative text-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowDeleteModal(false)
              }
            >
              <FaTimes size={13} />
            </button>

            <div className="warning-icon">
              <FaExclamationTriangle size={25} />
            </div>

            <h4 className="fw-bold mb-2">
              Delete Employee?
            </h4>

            <p className="text-muted mb-2">
              Are you sure you want to delete
            </p>

            <div
              className="fw-bold mb-2"
              style={{ color: "#1F2937" }}
            >
              {selectedEmployee.name}
            </div>

            <p
              className="small text-muted mb-4"
              style={{ lineHeight: 1.6 }}
            >
              This action will permanently remove this
              employee from the employee directory.
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-delete-btn d-flex align-items-center gap-2"
                onClick={handleDeleteConfirm}
              >
                <FaTrash size={12} />
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;