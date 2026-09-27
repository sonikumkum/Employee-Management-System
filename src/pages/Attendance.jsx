// STEP 48: Premium Attendance Management UI

import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUmbrellaBeach,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaChartBar,
  FaUserCircle,
} from "react-icons/fa";

import { getCurrentUser } from "../utils/auth";
import { getEmployees } from "../utils/helpers";
import employeesData from "../data/employees";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const ATTENDANCE_KEY =
  "employee_management_system_attendance";

const ATTENDANCE_STATUSES = [
  "Present",
  "Absent",
  "Late",
  "On Leave",
];

function Attendance() {
  const currentUser = getCurrentUser();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [activeTab, setActiveTab] = useState("daily");

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedEmployees = getEmployees(employeesData);

      setEmployees(storedEmployees);

      try {
        const storedAttendance =
          localStorage.getItem(ATTENDANCE_KEY);

        if (storedAttendance) {
          setAttendance(JSON.parse(storedAttendance));
        }
      } catch (error) {
        console.error(
          "Error loading attendance:",
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

  const saveAttendance = (updatedAttendance) => {
    setAttendance(updatedAttendance);

    localStorage.setItem(
      ATTENDANCE_KEY,
      JSON.stringify(updatedAttendance)
    );
  };

  const isAdminOrHR =
    currentUser?.role === "Admin" ||
    currentUser?.role === "HR";

  const visibleEmployees = useMemo(() => {
    let result = employees;

    if (!isAdminOrHR) {
      result = employees.filter(
        (employee) =>
          employee.id === currentUser?.employeeId
      );
    }

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter(
        (employee) =>
          employee.name
            ?.toLowerCase()
            .includes(search) ||
          employee.id
            ?.toLowerCase()
            .includes(search) ||
          employee.email
            ?.toLowerCase()
            .includes(search)
      );
    }

    if (departmentFilter) {
      result = result.filter(
        (employee) =>
          employee.department === departmentFilter
      );
    }

    return result;
  }, [
    employees,
    currentUser,
    isAdminOrHR,
    searchTerm,
    departmentFilter,
  ]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ].sort();
  }, [employees]);

  const getStatus = (employeeId, date) => {
    return attendance?.[date]?.[employeeId] || "";
  };

  const updateAttendance = (
    employeeId,
    status
  ) => {
    if (
      !isAdminOrHR &&
      employeeId !== currentUser?.employeeId
    ) {
      return;
    }

    const updatedAttendance = {
      ...attendance,
      [selectedDate]: {
        ...(attendance[selectedDate] || {}),
        [employeeId]: status,
      },
    };

    saveAttendance(updatedAttendance);

    setToast({
      show: true,
      message: "Attendance updated successfully.",
      type: "success",
    });
  };

  const markAllPresent = () => {
    if (!isAdminOrHR) return;

    const updatedAttendance = {
      ...attendance,
      [selectedDate]: {
        ...(attendance[selectedDate] || {}),
      },
    };

    visibleEmployees.forEach((employee) => {
      updatedAttendance[selectedDate][employee.id] =
        "Present";
    });

    saveAttendance(updatedAttendance);

    setToast({
      show: true,
      message: `${visibleEmployees.length} employees marked Present.`,
      type: "success",
    });
  };

  const dailyStats = useMemo(() => {
    const total = visibleEmployees.length;

    let present = 0;
    let absent = 0;
    let late = 0;
    let onLeave = 0;
    let marked = 0;

    visibleEmployees.forEach((employee) => {
      const status = getStatus(
        employee.id,
        selectedDate
      );

      if (status) marked += 1;

      if (status === "Present") present += 1;
      if (status === "Absent") absent += 1;
      if (status === "Late") late += 1;
      if (status === "On Leave") onLeave += 1;
    });

    const percentage =
      marked > 0
        ? Math.round(
            ((present + late) / marked) * 100
          )
        : 0;

    return {
      total,
      present,
      absent,
      late,
      onLeave,
      marked,
      percentage,
    };
  }, [
    visibleEmployees,
    selectedDate,
    attendance,
  ]);

  const monthlySummary = useMemo(() => {
    const monthRecords = {};

    visibleEmployees.forEach((employee) => {
      monthRecords[employee.id] = {
        employee,
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        totalMarked: 0,
      };
    });

    Object.entries(attendance).forEach(
      ([date, records]) => {
        if (!date.startsWith(selectedMonth)) return;

        Object.entries(records).forEach(
          ([employeeId, status]) => {
            if (!monthRecords[employeeId]) return;

            monthRecords[employeeId].totalMarked += 1;

            if (status === "Present") {
              monthRecords[employeeId].present += 1;
            }

            if (status === "Absent") {
              monthRecords[employeeId].absent += 1;
            }

            if (status === "Late") {
              monthRecords[employeeId].late += 1;
            }

            if (status === "On Leave") {
              monthRecords[employeeId].onLeave += 1;
            }
          }
        );
      }
    );

    return Object.values(monthRecords).map(
      (record) => {
        const percentage =
          record.totalMarked > 0
            ? Math.round(
                ((record.present + record.late) /
                  record.totalMarked) *
                  100
              )
            : 0;

        return {
          ...record,
          percentage,
        };
      }
    );
  }, [
    attendance,
    selectedMonth,
    visibleEmployees,
  ]);

  const monthlyTotals = useMemo(() => {
    return monthlySummary.reduce(
      (total, record) => ({
        present:
          total.present + record.present,
        absent:
          total.absent + record.absent,
        late: total.late + record.late,
        onLeave:
          total.onLeave + record.onLeave,
        marked:
          total.marked + record.totalMarked,
      }),
      {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        marked: 0,
      }
    );
  }, [monthlySummary]);

  const monthlyPercentage =
    monthlyTotals.marked > 0
      ? Math.round(
          ((monthlyTotals.present +
            monthlyTotals.late) /
            monthlyTotals.marked) *
            100
        )
      : 0;

  const getStatusConfig = (status) => {
    const configs = {
      Present: {
        className: "status-present",
        icon: <FaCheckCircle />,
      },
      Absent: {
        className: "status-absent",
        icon: <FaTimesCircle />,
      },
      Late: {
        className: "status-late",
        icon: <FaClock />,
      },
      "On Leave": {
        className: "status-leave",
        icon: <FaUmbrellaBeach />,
      },
    };

    return (
      configs[status] || {
        className: "status-empty",
        icon: null,
      }
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

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };

  const formatMonth = (month) => {
    if (!month) return "";

    return new Date(
      `${month}-01T00:00:00`
    ).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <LoadingSpinner message="Loading attendance..." />
    );
  }

  return (
    <div className="attendance-page">
      <style>
        {`
          .attendance-page {
            color: #172033;
            animation: attendancePageIn 0.55s ease;
          }

          @keyframes attendancePageIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .attendance-hero {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            padding: 28px;
            color: white;
            background:
              radial-gradient(
                circle at 85% 15%,
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

          .attendance-hero::before {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            right: -55px;
            top: -90px;
            background: rgba(255,255,255,0.08);
            animation: attendanceOrb 5s ease-in-out infinite;
          }

          .attendance-hero::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            right: 130px;
            bottom: -65px;
            background: rgba(255,255,255,0.06);
            animation: attendanceOrb 4s ease-in-out infinite reverse;
          }

          @keyframes attendanceOrb {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(12px);
            }
          }

          .attendance-hero-content {
            position: relative;
            z-index: 2;
          }

          .attendance-hero-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: rgba(255,255,255,0.16);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .date-box {
            min-width: 185px;
            padding: 10px 13px;
            border-radius: 13px;
            background: rgba(255,255,255,0.13);
            border: 1px solid rgba(255,255,255,0.18);
            backdrop-filter: blur(8px);
          }

          .date-box input {
            border: 0;
            background: transparent;
            color: white;
            outline: none;
            width: 100%;
            font-weight: 700;
          }

          .date-box input::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
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
            animation: statIn 0.5s ease backwards;
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

          .stat-card:nth-child(5) {
            animation-delay: 0.25s;
          }

          @keyframes statIn {
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

          .stat-green {
            background: #ECFDF5;
            color: #10B981;
          }

          .stat-red {
            background: #FEF2F2;
            color: #EF4444;
          }

          .stat-orange {
            background: #FFF7ED;
            color: #F97316;
          }

          .stat-purple {
            background: #F5F3FF;
            color: #8B5CF6;
          }

          .control-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            box-shadow:
              0 8px 25px rgba(31,41,55,0.04);
            animation: statIn 0.55s ease 0.15s backwards;
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

          .mark-all-btn {
            min-height: 45px;
            border: 0;
            border-radius: 12px;
            background:
              linear-gradient(135deg, #6366F1, #8B5CF6);
            color: white;
            font-weight: 700;
            padding: 0 17px;
            transition: all 0.25s ease;
            box-shadow:
              0 8px 18px rgba(99,102,241,0.20);
          }

          .mark-all-btn:hover {
            transform: translateY(-3px);
            box-shadow:
              0 12px 24px rgba(99,102,241,0.28);
          }

          .tabs-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 17px;
            padding: 5px;
            display: inline-flex;
            box-shadow:
              0 7px 20px rgba(31,41,55,0.05);
          }

          .tab-btn {
            border: 0;
            background: transparent;
            color: #6B7280;
            padding: 10px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            transition: all 0.22s ease;
          }

          .tab-btn:hover {
            color: #6366F1;
            background: #F8F9FF;
          }

          .tab-btn.active {
            color: white;
            background:
              linear-gradient(135deg, #6366F1, #8B5CF6);
            box-shadow:
              0 6px 15px rgba(99,102,241,0.20);
          }

          .attendance-table-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            overflow: hidden;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.05);
            animation: statIn 0.6s ease 0.2s backwards;
          }

          .table-header {
            padding: 20px 22px;
            border-bottom: 1px solid #F0F1F6;
          }

          .attendance-table {
            margin: 0;
            vertical-align: middle;
          }

          .attendance-table thead th {
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

          .attendance-table tbody td {
            padding: 15px 18px;
            border-color: #F1F2F6;
          }

          .attendance-table tbody tr {
            transition: background 0.2s ease;
          }

          .attendance-table tbody tr:hover {
            background: #F8F9FF;
          }

          .employee-avatar {
            width: 42px;
            height: 42px;
            min-width: 42px;
            border-radius: 13px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
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

          .status-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .attendance-status-btn {
            border: 1px solid #E5E7EB;
            background: white;
            border-radius: 9px;
            padding: 6px 9px;
            font-size: 10px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s ease;
          }

          .attendance-status-btn:hover {
            transform: translateY(-2px);
          }

          .attendance-status-btn.selected.status-present {
            background: #ECFDF5;
            border-color: #A7F3D0;
            color: #047857;
          }

          .attendance-status-btn.selected.status-absent {
            background: #FEF2F2;
            border-color: #FECACA;
            color: #B91C1C;
          }

          .attendance-status-btn.selected.status-late {
            background: #FFF7ED;
            border-color: #FED7AA;
            color: #C2410C;
          }

          .attendance-status-btn.selected.status-leave {
            background: #F5F3FF;
            border-color: #DDD6FE;
            color: #6D28D9;
          }

          .attendance-status-btn.status-empty:hover {
            background: #F8F9FF;
            border-color: #C7D2FE;
            color: #6366F1;
          }

          .current-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
          }

          .current-present {
            background: #ECFDF5;
            color: #047857;
          }

          .current-absent {
            background: #FEF2F2;
            color: #B91C1C;
          }

          .current-late {
            background: #FFF7ED;
            color: #C2410C;
          }

          .current-leave {
            background: #F5F3FF;
            color: #6D28D9;
          }

          .not-marked {
            color: #9CA3AF;
            font-size: 11px;
            font-weight: 600;
          }

          .monthly-table {
            min-width: 850px;
          }

          .percentage-circle {
            width: 43px;
            height: 43px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              conic-gradient(
                #6366F1 var(--percentage),
                #EEF0F7 0
              );
            position: relative;
          }

          .percentage-circle::after {
            content: "";
            position: absolute;
            width: 33px;
            height: 33px;
            background: white;
            border-radius: 50%;
          }

          .percentage-value {
            position: relative;
            z-index: 2;
            font-size: 9px;
            font-weight: 800;
            color: #4F46E5;
          }

          .summary-mini {
            border-radius: 12px;
            padding: 10px;
            text-align: center;
            background: #F8F9FC;
          }

          .summary-mini-value {
            font-weight: 800;
            font-size: 15px;
          }

          .summary-mini-label {
            font-size: 9px;
            color: #6B7280;
            margin-top: 2px;
          }

          @media (max-width: 767px) {
            .attendance-hero {
              padding: 22px;
              border-radius: 20px;
            }

            .attendance-hero h1 {
              font-size: 23px !important;
            }

            .attendance-hero-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
            }

            .date-box {
              min-width: 100%;
              margin-top: 15px;
            }

            .tabs-card {
              width: 100%;
            }

            .tab-btn {
              flex: 1;
              padding: 9px 8px;
            }

            .attendance-table-card {
              border-radius: 18px;
            }

            .attendance-table-wrapper {
              overflow-x: auto;
            }

            .attendance-table {
              min-width: 1050px;
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
      <div className="attendance-hero mb-4">
        <div className="attendance-hero-content">
          <div className="row align-items-center">
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center gap-3">
                <div className="attendance-hero-icon">
                  <FaCalendarCheck size={25} />
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
                    Workforce Tracking
                  </div>

                  <h1
                    className="fw-bold mb-1"
                    style={{ fontSize: "30px" }}
                  >
                    Attendance
                  </h1>

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "rgba(255,255,255,0.82)",
                      fontSize: "14px",
                    }}
                  >
                    Track daily attendance and
                    monitor workforce presence.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="date-box ms-lg-auto">
                <div
                  className="small mb-1"
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 800,
                  }}
                >
                  Selected Date
                </div>

                <div className="d-flex align-items-center gap-2">
                  <FaCalendarAlt size={13} />

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) =>
                      setSelectedDate(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY STATS */}
      {activeTab === "daily" && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Total
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                    }}
                  >
                    {dailyStats.total}
                  </div>

                  <div className="small text-muted">
                    Employees
                  </div>
                </div>

                <div className="stat-icon stat-indigo">
                  <FaUsers size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Present
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#059669",
                    }}
                  >
                    {dailyStats.present}
                  </div>

                  <div className="small text-muted">
                    On time
                  </div>
                </div>

                <div className="stat-icon stat-green">
                  <FaCheckCircle size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Absent
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#DC2626",
                    }}
                  >
                    {dailyStats.absent}
                  </div>

                  <div className="small text-muted">
                    Not present
                  </div>
                </div>

                <div className="stat-icon stat-red">
                  <FaTimesCircle size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Late
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#EA580C",
                    }}
                  >
                    {dailyStats.late}
                  </div>

                  <div className="small text-muted">
                    Late arrivals
                  </div>
                </div>

                <div className="stat-icon stat-orange">
                  <FaClock size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Attendance
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#7C3AED",
                    }}
                  >
                    {dailyStats.percentage}%
                  </div>

                  <div className="small text-muted">
                    Marked: {dailyStats.marked}
                  </div>
                </div>

                <div className="stat-icon stat-purple">
                  <FaChartBar size={19} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY STATS */}
      {activeTab === "monthly" && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Present
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#059669",
                    }}
                  >
                    {monthlyTotals.present}
                  </div>

                  <div className="small text-muted">
                    Monthly total
                  </div>
                </div>

                <div className="stat-icon stat-green">
                  <FaCheckCircle size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Absent
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#DC2626",
                    }}
                  >
                    {monthlyTotals.absent}
                  </div>

                  <div className="small text-muted">
                    Monthly total
                  </div>
                </div>

                <div className="stat-icon stat-red">
                  <FaTimesCircle size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Late
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#EA580C",
                    }}
                  >
                    {monthlyTotals.late}
                  </div>

                  <div className="small text-muted">
                    Monthly total
                  </div>
                </div>

                <div className="stat-icon stat-orange">
                  <FaClock size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    On Leave
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#7C3AED",
                    }}
                  >
                    {monthlyTotals.onLeave}
                  </div>

                  <div className="small text-muted">
                    Monthly total
                  </div>
                </div>

                <div className="stat-icon stat-purple">
                  <FaUmbrellaBeach size={19} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl">
            <div className="stat-card">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted fw-semibold mb-2">
                    Attendance
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "29px",
                      color: "#4F46E5",
                    }}
                  >
                    {monthlyPercentage}%
                  </div>

                  <div className="small text-muted">
                    {formatMonth(selectedMonth)}
                  </div>
                </div>

                <div className="stat-icon stat-indigo">
                  <FaChartBar size={19} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="control-card mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="modern-label">
              Search Employee
            </label>

            <div className="search-box">
              <FaSearch size={13} />

              <input
                type="text"
                className="form-control modern-input"
                placeholder="Search name, ID or email..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          {isAdminOrHR && (
            <div className="col-12 col-md-3">
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

          {activeTab === "monthly" && (
            <div className="col-12 col-md-3">
              <label className="modern-label">
                Month
              </label>

              <input
                type="month"
                className="form-control modern-input"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    event.target.value
                  )
                }
              />
            </div>
          )}

          {activeTab === "daily" &&
            isAdminOrHR && (
              <div className="col-12 col-md-3">
                <button
                  type="button"
                  className="mark-all-btn w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={markAllPresent}
                >
                  <FaCheckCircle size={13} />
                  Mark All Present
                </button>
              </div>
            )}
        </div>
      </div>

      {/* TABS */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div className="tabs-card">
          <button
            type="button"
            className={`tab-btn ${
              activeTab === "daily" ? "active" : ""
            }`}
            onClick={() => setActiveTab("daily")}
          >
            <FaCalendarCheck
              size={12}
              className="me-2"
            />
            Daily Attendance
          </button>

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "monthly" ? "active" : ""
            }`}
            onClick={() =>
              setActiveTab("monthly")
            }
          >
            <FaChartBar
              size={12}
              className="me-2"
            />
            Monthly Summary
          </button>
        </div>

        <div
          className="small text-muted"
          style={{ fontWeight: 600 }}
        >
          {activeTab === "daily"
            ? formatDate(selectedDate)
            : formatMonth(selectedMonth)}
        </div>
      </div>

      {/* DAILY TABLE */}
      {activeTab === "daily" && (
        <div className="attendance-table-card">
          <div className="table-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">
                  Daily Attendance
                </h5>

                <div className="small text-muted">
                  Update attendance status for{" "}
                  {formatDate(selectedDate)}
                </div>
              </div>

              <div
                className="d-flex align-items-center gap-2"
                style={{
                  color: "#6366F1",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <FaUsers size={12} />
                {visibleEmployees.length} Employees
              </div>
            </div>
          </div>

          {visibleEmployees.length === 0 ? (
            <div className="text-center py-5">
              <FaUserCircle
                size={42}
                style={{
                  color: "#CBD5E1",
                }}
              />

              <h6 className="fw-bold mt-3">
                No employees found
              </h6>

              <p className="small text-muted mb-0">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table attendance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Mark Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleEmployees.map(
                    (employee, index) => {
                      const currentStatus =
                        getStatus(
                          employee.id,
                          selectedDate
                        );

                      const statusConfig =
                        getStatusConfig(
                          currentStatus
                        );

                      return (
                        <tr key={employee.id}>
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
                            <span
                              className="small fw-semibold"
                              style={{
                                color: "#4B5563",
                              }}
                            >
                              {employee.department ||
                                "—"}
                            </span>
                          </td>

                          <td>
                            {currentStatus ? (
                              <span
                                className={`current-status ${
                                  currentStatus ===
                                  "Present"
                                    ? "current-present"
                                    : currentStatus ===
                                      "Absent"
                                    ? "current-absent"
                                    : currentStatus ===
                                      "Late"
                                    ? "current-late"
                                    : "current-leave"
                                }`}
                              >
                                {statusConfig.icon}
                                {currentStatus}
                              </span>
                            ) : (
                              <span className="not-marked">
                                Not marked
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="status-group">
                              {ATTENDANCE_STATUSES.map(
                                (status) => {
                                  const config =
                                    getStatusConfig(
                                      status
                                    );

                                  return (
                                    <button
                                      key={status}
                                      type="button"
                                      className={`attendance-status-btn ${
                                        config.className
                                      } ${
                                        currentStatus ===
                                        status
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        updateAttendance(
                                          employee.id,
                                          status
                                        )
                                      }
                                    >
                                      {config.icon}
                                      {status}
                                    </button>
                                  );
                                }
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
      )}

      {/* MONTHLY TABLE */}
      {activeTab === "monthly" && (
        <div className="attendance-table-card">
          <div className="table-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">
                  Monthly Attendance Summary
                </h5>

                <div className="small text-muted">
                  Attendance overview for{" "}
                  {formatMonth(selectedMonth)}
                </div>
              </div>

              <div
                className="d-flex align-items-center gap-2"
                style={{
                  color: "#6366F1",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <FaChartBar size={12} />
                {monthlySummary.length} Employees
              </div>
            </div>
          </div>

          {monthlySummary.length === 0 ? (
            <div className="text-center py-5">
              <FaChartBar
                size={42}
                style={{
                  color: "#CBD5E1",
                }}
              />

              <h6 className="fw-bold mt-3">
                No attendance data
              </h6>

              <p className="small text-muted mb-0">
                Attendance records will appear here
                once marked.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table attendance-table monthly-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>On Leave</th>
                    <th>Marked</th>
                    <th>Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {monthlySummary.map(
                    (record, index) => (
                      <tr key={record.employee.id}>
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
                                record.employee.name
                              )}
                            </div>

                            <div>
                              <div className="employee-name">
                                {record.employee.name}
                              </div>

                              <div className="employee-id">
                                {
                                  record.employee
                                    .id
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className="fw-bold"
                            style={{
                              color: "#059669",
                            }}
                          >
                            {record.present}
                          </span>
                        </td>

                        <td>
                          <span
                            className="fw-bold"
                            style={{
                              color: "#DC2626",
                            }}
                          >
                            {record.absent}
                          </span>
                        </td>

                        <td>
                          <span
                            className="fw-bold"
                            style={{
                              color: "#EA580C",
                            }}
                          >
                            {record.late}
                          </span>
                        </td>

                        <td>
                          <span
                            className="fw-bold"
                            style={{
                              color: "#7C3AED",
                            }}
                          >
                            {record.onLeave}
                          </span>
                        </td>

                        <td>
                          <span className="fw-semibold">
                            {record.totalMarked}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="percentage-circle"
                              style={{
                                "--percentage": `${record.percentage}%`,
                              }}
                            >
                              <span className="percentage-value">
                                {
                                  record.percentage
                                }
                                %
                              </span>
                            </div>

                            <div>
                              <div
                                className="fw-bold"
                                style={{
                                  color:
                                    record.percentage >=
                                    75
                                      ? "#059669"
                                      : record.percentage >=
                                        50
                                      ? "#D97706"
                                      : "#DC2626",
                                }}
                              >
                                {
                                  record.percentage
                                }
                                %
                              </div>

                              <div className="small text-muted">
                                Attendance
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Attendance;