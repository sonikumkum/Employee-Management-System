// STEP 49: Premium Leave Management UI

import { useEffect, useMemo, useState } from "react";
import {
  FaUmbrellaBeach,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import { getCurrentUser } from "../utils/auth";
import { getEmployees } from "../utils/helpers";
import employeesData from "../data/employees";

import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const LEAVES_KEY =
  "employee_management_system_leaves";

const LEAVE_TYPES = [
  "Casual",
  "Sick",
  "Annual",
  "Emergency",
  "Maternity",
];

function Leaves() {
  const currentUser = getCurrentUser();

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [formData, setFormData] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const isAdminOrHR =
    currentUser?.role === "Admin" ||
    currentUser?.role === "HR";

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedEmployees =
        getEmployees(employeesData);

      setEmployees(storedEmployees);

      try {
        const storedLeaves =
          localStorage.getItem(LEAVES_KEY);

        if (storedLeaves) {
          setLeaves(JSON.parse(storedLeaves));
        }
      } catch (error) {
        console.error(
          "Error loading leaves:",
          error
        );
      }

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

  const saveLeaves = (updatedLeaves) => {
    setLeaves(updatedLeaves);

    localStorage.setItem(
      LEAVES_KEY,
      JSON.stringify(updatedLeaves)
    );
  };

  const departments = useMemo(() => {
    return [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ].sort();
  }, [employees]);

  const visibleLeaves = useMemo(() => {
    let result = leaves;

    if (!isAdminOrHR) {
      result = result.filter(
        (leave) =>
          leave.employeeId ===
          currentUser?.employeeId
      );
    }

    const search =
      searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((leave) => {
        const employee = employees.find(
          (item) => item.id === leave.employeeId
        );

        return (
          leave.id
            ?.toLowerCase()
            .includes(search) ||
          leave.type
            ?.toLowerCase()
            .includes(search) ||
          employee?.name
            ?.toLowerCase()
            .includes(search) ||
          employee?.email
            ?.toLowerCase()
            .includes(search)
        );
      });
    }

    if (statusFilter) {
      result = result.filter(
        (leave) =>
          leave.status === statusFilter
      );
    }

    if (departmentFilter) {
      result = result.filter((leave) => {
        const employee = employees.find(
          (item) => item.id === leave.employeeId
        );

        return (
          employee?.department ===
          departmentFilter
        );
      });
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  }, [
    leaves,
    employees,
    currentUser,
    isAdminOrHR,
    searchTerm,
    statusFilter,
    departmentFilter,
  ]);

  const stats = useMemo(() => {
    const source = isAdminOrHR
      ? leaves
      : leaves.filter(
          (leave) =>
            leave.employeeId ===
            currentUser?.employeeId
        );

    return {
      total: source.length,
      pending: source.filter(
        (leave) => leave.status === "Pending"
      ).length,
      approved: source.filter(
        (leave) => leave.status === "Approved"
      ).length,
      rejected: source.filter(
        (leave) => leave.status === "Rejected"
      ).length,
    };
  }, [leaves, currentUser, isAdminOrHR]);

  const getEmployee = (employeeId) => {
    return employees.find(
      (employee) => employee.id === employeeId
    );
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #6366F1, #8B5CF6)",
      "linear-gradient(135deg, #06B6D4, #3B82F6)",
      "linear-gradient(135deg, #10B981, #14B8A6)",
      "linear-gradient(135deg, #EC4899, #8B5CF6)",
      "linear-gradient(135deg, #F59E0B, #EF4444)",
    ];

    return gradients[index % gradients.length];
  };

  const calculateDays = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(
      `${startDate}T00:00:00`
    );

    const end = new Date(
      `${endDate}T00:00:00`
    );

    const difference =
      end.getTime() - start.getTime();

    if (difference < 0) return 0;

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      type: "Casual",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentUser?.employeeId) {
      setToast({
        show: true,
        message:
          "Your account is not linked to an employee profile.",
        type: "error",
      });

      return;
    }

    if (
      !formData.startDate ||
      !formData.endDate
    ) {
      setToast({
        show: true,
        message:
          "Please select start and end dates.",
        type: "error",
      });

      return;
    }

    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      setToast({
        show: true,
        message:
          "End date cannot be before start date.",
        type: "error",
      });

      return;
    }

    if (!formData.reason.trim()) {
      setToast({
        show: true,
        message: "Please enter a reason for leave.",
        type: "error",
      });

      return;
    }

    setSaving(true);

    setTimeout(() => {
      const nextNumber =
        leaves.reduce((max, leave) => {
          const number = parseInt(
            leave.id?.replace("LV", ""),
            10
          );

          return Number.isNaN(number)
            ? max
            : Math.max(max, number);
        }, 0) + 1;

      const newLeave = {
        id: `LV${String(nextNumber).padStart(
          3,
          "0"
        )}`,
        employeeId: currentUser.employeeId,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      saveLeaves([...leaves, newLeave]);

      resetForm();
      setShowForm(false);
      setSaving(false);

      setToast({
        show: true,
        message:
          "Leave application submitted successfully.",
        type: "success",
      });
    }, 450);
  };

  const updateLeaveStatus = (
    leaveId,
    status
  ) => {
    if (!isAdminOrHR) return;

    const updatedLeaves = leaves.map((leave) =>
      leave.id === leaveId
        ? {
            ...leave,
            status,
            updatedAt:
              new Date().toISOString(),
          }
        : leave
    );

    saveLeaves(updatedLeaves);

    setToast({
      show: true,
      message: `Leave ${status.toLowerCase()} successfully.`,
      type: "success",
    });
  };

  const handleDelete = (leaveId) => {
    const leave = leaves.find(
      (item) => item.id === leaveId
    );

    if (!leave) return;

    if (
      !isAdminOrHR &&
      !(
        leave.employeeId ===
          currentUser?.employeeId &&
        leave.status === "Pending"
      )
    ) {
      return;
    }

    const updatedLeaves = leaves.filter(
      (item) => item.id !== leaveId
    );

    saveLeaves(updatedLeaves);

    setToast({
      show: true,
      message: "Leave request deleted.",
      type: "success",
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        className: "status-pending",
        icon: <FaHourglassHalf />,
      },
      Approved: {
        className: "status-approved",
        icon: <FaCheckCircle />,
      },
      Rejected: {
        className: "status-rejected",
        icon: <FaTimesCircle />,
      },
    };

    return (
      configs[status] || {
        className: "status-pending",
        icon: <FaHourglassHalf />,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <LoadingSpinner message="Loading leave management..." />
    );
  }

  return (
    <div className="leaves-page">
      <style>
        {`
          .leaves-page {
            color: #172033;
            animation: leavePageIn 0.55s ease;
          }

          @keyframes leavePageIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .leave-hero {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            padding: 28px;
            color: white;
            background:
              radial-gradient(
                circle at 86% 15%,
                rgba(255,255,255,0.18),
                transparent 25%
              ),
              linear-gradient(
                135deg,
                #4338CA,
                #6366F1 48%,
                #8B5CF6
              );
            box-shadow:
              0 18px 45px rgba(79,70,229,0.20);
          }

          .leave-hero::before {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            right: -55px;
            top: -90px;
            background: rgba(255,255,255,0.08);
            animation: leaveOrb 5s ease-in-out infinite;
          }

          .leave-hero::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            right: 130px;
            bottom: -65px;
            background: rgba(255,255,255,0.06);
            animation: leaveOrb 4s ease-in-out infinite reverse;
          }

          @keyframes leaveOrb {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(12px);
            }
          }

          .leave-hero-content {
            position: relative;
            z-index: 2;
          }

          .leave-hero-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: rgba(255,255,255,0.16);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .apply-leave-btn {
            border: 0;
            border-radius: 13px;
            background: white;
            color: #4F46E5;
            font-weight: 800;
            padding: 11px 17px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s ease;
            box-shadow:
              0 8px 20px rgba(0,0,0,0.12);
          }

          .apply-leave-btn:hover {
            transform: translateY(-3px);
            color: #4338CA;
            box-shadow:
              0 12px 25px rgba(0,0,0,0.18);
          }

          .stat-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            height: 100%;
            transition:
              transform 0.28s ease,
              box-shadow 0.28s ease;
            animation: leaveStatIn 0.5s ease backwards;
          }

          .stat-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 18px 35px rgba(31,41,55,0.10);
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

          @keyframes leaveStatIn {
            from {
              opacity: 0;
              transform: translateY(18px);
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

          .stat-indigo {
            background: #EEF2FF;
            color: #6366F1;
          }

          .stat-orange {
            background: #FFF7ED;
            color: #F97316;
          }

          .stat-green {
            background: #ECFDF5;
            color: #10B981;
          }

          .stat-red {
            background: #FEF2F2;
            color: #EF4444;
          }

          .controls-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            box-shadow:
              0 8px 25px rgba(31,41,55,0.04);
            animation: leaveStatIn 0.55s ease 0.15s backwards;
          }

          .modern-label {
            display: block;
            color: #6B7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 800;
            margin-bottom: 7px;
          }

          .modern-input,
          .modern-select {
            min-height: 45px;
            border: 1px solid #E5E7EB !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            transition: all 0.2s ease;
          }

          .modern-input:focus,
          .modern-select:focus {
            border-color: #818CF8 !important;
            box-shadow:
              0 0 0 4px rgba(99,102,241,0.10) !important;
          }

          .search-box {
            position: relative;
          }

          .search-box svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #9CA3AF;
            z-index: 2;
          }

          .search-box input {
            padding-left: 42px;
          }

          .filter-clear {
            min-height: 45px;
            border: 1px solid #E0E7FF;
            background: #F5F3FF;
            color: #6366F1;
            border-radius: 12px;
            font-weight: 700;
            padding: 0 14px;
            transition: all 0.2s ease;
          }

          .filter-clear:hover {
            background: #EDE9FE;
            transform: translateY(-2px);
          }

          .form-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            padding: 22px;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.06);
            animation: formSlide 0.3s ease;
          }

          @keyframes formSlide {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .form-title-icon {
            width: 42px;
            height: 42px;
            border-radius: 13px;
            background: #EEF2FF;
            color: #6366F1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .submit-leave-btn {
            border: 0;
            border-radius: 12px;
            padding: 11px 18px;
            color: white;
            font-weight: 800;
            background:
              linear-gradient(135deg, #6366F1, #8B5CF6);
            box-shadow:
              0 8px 18px rgba(99,102,241,0.20);
            transition: all 0.25s ease;
          }

          .submit-leave-btn:hover {
            transform: translateY(-2px);
            box-shadow:
              0 12px 24px rgba(99,102,241,0.28);
          }

          .cancel-form-btn {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            background: white;
            color: #4B5563;
            padding: 10px 17px;
            font-weight: 700;
          }

          .cancel-form-btn:hover {
            background: #F9FAFB;
          }

          .leave-table-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            overflow: hidden;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.05);
            animation: leaveStatIn 0.6s ease 0.2s backwards;
          }

          .table-header {
            padding: 20px 22px;
            border-bottom: 1px solid #F0F1F6;
          }

          .leave-table {
            margin: 0;
            vertical-align: middle;
          }

          .leave-table thead th {
            background: #FAFAFD;
            color: #6B7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 800;
            padding: 14px 18px;
            border-bottom: 1px solid #EEF0F7;
            white-space: nowrap;
          }

          .leave-table tbody td {
            padding: 15px 18px;
            border-color: #F1F2F6;
          }

          .leave-table tbody tr {
            transition: background 0.2s ease;
          }

          .leave-table tbody tr:hover {
            background: #F8F9FF;
          }

          .employee-avatar {
            width: 42px;
            height: 42px;
            min-width: 42px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: 800;
            box-shadow:
              0 7px 16px rgba(79,70,229,0.15);
          }

          .employee-name {
            font-weight: 700;
            color: #1F2937;
          }

          .employee-id {
            font-size: 11px;
            color: #818CF8;
            font-weight: 700;
          }

          .leave-id {
            display: inline-block;
            padding: 5px 8px;
            border-radius: 8px;
            background: #F5F3FF;
            color: #6366F1;
            font-size: 10px;
            font-weight: 800;
          }

          .leave-type {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 9px;
            background: #F8F9FC;
            color: #4B5563;
            font-size: 11px;
            font-weight: 800;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
          }

          .status-pending {
            background: #FFF7ED;
            color: #C2410C;
          }

          .status-approved {
            background: #ECFDF5;
            color: #047857;
          }

          .status-rejected {
            background: #FEF2F2;
            color: #B91C1C;
          }

          .status-pending svg {
            animation: pendingPulse 1.8s ease-in-out infinite;
          }

          @keyframes pendingPulse {
            0%, 100% {
              opacity: 1;
            }

            50% {
              opacity: 0.45;
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

          .approve-btn {
            color: #059669;
          }

          .approve-btn:hover {
            background: #ECFDF5;
            border-color: #A7F3D0;
          }

          .reject-btn {
            color: #EF4444;
          }

          .reject-btn:hover {
            background: #FEF2F2;
            border-color: #FECACA;
          }

          .delete-btn {
            color: #EF4444;
          }

          .delete-btn:hover {
            background: #FEF2F2;
            border-color: #FECACA;
          }

          .reason-text {
            max-width: 190px;
            color: #6B7280;
            font-size: 12px;
            line-height: 1.5;
          }

          .days-badge {
            display: inline-block;
            min-width: 38px;
            text-align: center;
            padding: 5px 7px;
            border-radius: 8px;
            background: #EEF2FF;
            color: #4F46E5;
            font-size: 11px;
            font-weight: 800;
          }

          @media (max-width: 767px) {
            .leave-hero {
              padding: 22px;
              border-radius: 20px;
            }

            .leave-hero h1 {
              font-size: 23px !important;
            }

            .leave-hero-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
            }

            .apply-leave-btn {
              margin-top: 18px;
              width: 100%;
              justify-content: center;
            }

            .controls-card {
              padding: 16px;
              border-radius: 18px;
            }

            .form-card {
              padding: 17px;
              border-radius: 18px;
            }

            .leave-table-card {
              border-radius: 18px;
            }

            .leave-table-wrapper {
              overflow-x: auto;
            }

            .leave-table {
              min-width: 1000px;
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
      <div className="leave-hero mb-4">
        <div className="leave-hero-content">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-3">
                <div className="leave-hero-icon">
                  <FaUmbrellaBeach size={25} />
                </div>

                <div>
                  <div
                    className="small mb-1"
                    style={{
                      color:
                        "rgba(255,255,255,0.78)",
                      fontWeight: 600,
                    }}
                  >
                    Time Off Management
                  </div>

                  <h1
                    className="fw-bold mb-1"
                    style={{ fontSize: "30px" }}
                  >
                    Leave Management
                  </h1>

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "rgba(255,255,255,0.82)",
                      fontSize: "14px",
                    }}
                  >
                    Apply, review and manage employee
                    leave requests.
                  </p>
                </div>
              </div>
            </div>

            {!isAdminOrHR && (
              <div className="col-12 col-lg-4 text-lg-end">
                <button
                  type="button"
                  className="apply-leave-btn"
                  onClick={() =>
                    setShowForm(
                      (previous) => !previous
                    )
                  }
                >
                  <FaPlus size={12} />
                  Apply for Leave
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Total Requests
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#4F46E5",
                  }}
                >
                  {stats.total}
                </div>

                <div className="small text-muted">
                  Leave applications
                </div>
              </div>

              <div className="stat-icon stat-indigo">
                <FaCalendarAlt size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Pending
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#EA580C",
                  }}
                >
                  {stats.pending}
                </div>

                <div className="small text-muted">
                  Awaiting review
                </div>
              </div>

              <div className="stat-icon stat-orange">
                <FaClock size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Approved
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#059669",
                  }}
                >
                  {stats.approved}
                </div>

                <div className="small text-muted">
                  Approved requests
                </div>
              </div>

              <div className="stat-icon stat-green">
                <FaCheckCircle size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Rejected
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#DC2626",
                  }}
                >
                  {stats.rejected}
                </div>

                <div className="small text-muted">
                  Rejected requests
                </div>
              </div>

              <div className="stat-icon stat-red">
                <FaTimesCircle size={19} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APPLY FORM */}
      {showForm && !isAdminOrHR && (
        <div className="form-card mb-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="form-title-icon">
              <FaUmbrellaBeach size={17} />
            </div>

            <div>
              <h5 className="fw-bold mb-1">
                Apply for Leave
              </h5>

              <div className="small text-muted">
                Submit a new leave request for review.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="modern-label">
                  Leave Type
                </label>

                <select
                  name="type"
                  className="form-select modern-select"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  {LEAVE_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type} Leave
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="modern-label">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  className="form-control modern-input"
                  value={formData.startDate}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="modern-label">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  className="form-control modern-input"
                  value={formData.endDate}
                  min={formData.startDate || undefined}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="modern-label">
                  Duration
                </label>

                <div
                  className="form-control modern-input d-flex align-items-center"
                  style={{
                    background: "#F8F9FC",
                    color: "#6366F1",
                    fontWeight: 800,
                  }}
                >
                  {calculateDays(
                    formData.startDate,
                    formData.endDate
                  )}{" "}
                  {calculateDays(
                    formData.startDate,
                    formData.endDate
                  ) === 1
                    ? "Day"
                    : "Days"}
                </div>
              </div>

              <div className="col-12">
                <label className="modern-label">
                  Reason
                </label>

                <textarea
                  name="reason"
                  className="form-control modern-input"
                  rows="3"
                  placeholder="Enter the reason for your leave..."
                  value={formData.reason}
                  onChange={handleFormChange}
                  style={{
                    resize: "vertical",
                    paddingTop: "12px",
                  }}
                />
              </div>

              <div className="col-12">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="cancel-form-btn"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-leave-btn d-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheck size={12} />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className="controls-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <label className="modern-label">
              Search
            </label>

            <div className="search-box">
              <FaSearch size={13} />

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Search employee, leave ID or type..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-2.5">
            <label className="modern-label">
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
              <option value="Pending">Pending</option>
              <option value="Approved">
                Approved
              </option>
              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          {isAdminOrHR && (
            <div className="col-12 col-sm-6 col-lg-2.5">
              <label className="modern-label">
                Department
              </label>

              <select
                className="form-select modern-select"
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All Departments
                </option>

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
          )}

          <div className="col-12 col-lg-2">
            <button
              type="button"
              className="filter-clear w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setDepartmentFilter("");
              }}
            >
              <FaFilter size={11} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* LEAVE TABLE */}
      <div className="leave-table-card">
        <div className="table-header">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">
                Leave Requests
              </h5>

              <div className="small text-muted">
                Review and manage leave applications
              </div>
            </div>

            <div
              className="d-flex align-items-center gap-2"
              style={{
                color: "#6366F1",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              <FaCalendarAlt size={12} />
              {visibleLeaves.length} Requests
            </div>
          </div>
        </div>

        {visibleLeaves.length === 0 ? (
          <div className="py-5">
            <EmptyState
              title="No leave requests found"
              message={
                searchTerm ||
                statusFilter ||
                departmentFilter
                  ? "Try changing your search or filters."
                  : "No leave applications are available yet."
              }
            />
          </div>
        ) : (
          <div className="leave-table-wrapper">
            <table className="table leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave ID</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleLeaves.map(
                  (leave, index) => {
                    const employee = getEmployee(
                      leave.employeeId
                    );

                    const statusConfig =
                      getStatusConfig(
                        leave.status
                      );

                    const days = calculateDays(
                      leave.startDate,
                      leave.endDate
                    );

                    return (
                      <tr key={leave.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="employee-avatar"
                              style={{
                                background:
                                  getAvatarGradient(
                                    index
                                  ),
                              }}
                            >
                              {getInitials(
                                employee?.name ||
                                  "User"
                              )}
                            </div>

                            <div>
                              <div className="employee-name">
                                {employee?.name ||
                                  "Unknown Employee"}
                              </div>

                              <div className="employee-id">
                                {leave.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="leave-id">
                            {leave.id}
                          </span>
                        </td>

                        <td>
                          <span className="leave-type">
                            <FaUmbrellaBeach
                              size={10}
                              style={{
                                color: "#6366F1",
                              }}
                            />

                            {leave.type}
                          </span>
                        </td>

                        <td>
                          <div>
                            <span className="days-badge">
                              {days}{" "}
                              {days === 1
                                ? "Day"
                                : "Days"}
                            </span>

                            <div
                              className="small text-muted mt-1"
                              style={{
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {formatDate(
                                leave.startDate
                              )}
                              {" → "}
                              {formatDate(
                                leave.endDate
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div
                            className="reason-text"
                            title={leave.reason}
                          >
                            {leave.reason}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${statusConfig.className}`}
                          >
                            {statusConfig.icon}
                            {leave.status}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {isAdminOrHR &&
                              leave.status ===
                                "Pending" && (
                                <>
                                  <button
                                    type="button"
                                    className="action-btn approve-btn"
                                    title="Approve"
                                    onClick={() =>
                                      updateLeaveStatus(
                                        leave.id,
                                        "Approved"
                                      )
                                    }
                                  >
                                    <FaCheck
                                      size={12}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="action-btn reject-btn"
                                    title="Reject"
                                    onClick={() =>
                                      updateLeaveStatus(
                                        leave.id,
                                        "Rejected"
                                      )
                                    }
                                  >
                                    <FaTimes
                                      size={12}
                                    />
                                  </button>
                                </>
                              )}

                            {(isAdminOrHR ||
                              (leave.employeeId ===
                                currentUser?.employeeId &&
                                leave.status ===
                                  "Pending")) && (
                              <button
                                type="button"
                                className="action-btn delete-btn"
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    leave.id
                                  )
                                }
                              >
                                <FaTrash
                                  size={11}
                                />
                              </button>
                            )}
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
    </div>
  );
}

export default Leaves;