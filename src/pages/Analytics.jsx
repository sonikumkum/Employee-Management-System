// STEP 50: Premium Analytics Dashboard

import { useEffect, useMemo, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaUserCheck,
  FaBuilding,
  FaUmbrellaBeach,
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getEmployees } from "../utils/helpers";
import employeesData from "../data/employees";
import LoadingSpinner from "../components/LoadingSpinner";

const ATTENDANCE_KEY =
  "employee_management_system_attendance";

const LEAVES_KEY =
  "employee_management_system_leaves";

const CHART_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

function Analytics() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(getEmployees(employeesData));

      try {
        const storedAttendance =
          localStorage.getItem(ATTENDANCE_KEY);

        const storedLeaves =
          localStorage.getItem(LEAVES_KEY);

        if (storedAttendance) {
          setAttendance(
            JSON.parse(storedAttendance)
          );
        }

        if (storedLeaves) {
          setLeaves(JSON.parse(storedLeaves));
        }
      } catch (error) {
        console.error(
          "Error loading analytics data:",
          error
        );
      }

      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status?.toLowerCase() === "active"
  ).length;

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const totalDepartments = departments.length;

  const totalLeaveRequests = leaves.length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const attendanceRecords = useMemo(() => {
    const records = [];

    Object.entries(attendance).forEach(
      ([date, employeeRecords]) => {
        Object.entries(employeeRecords).forEach(
          ([employeeId, status]) => {
            records.push({
              date,
              employeeId,
              status,
            });
          }
        );
      }
    );

    return records;
  }, [attendance]);

  const attendanceStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let onLeave = 0;

    attendanceRecords.forEach((record) => {
      if (record.status === "Present") present++;
      if (record.status === "Absent") absent++;
      if (record.status === "Late") late++;
      if (record.status === "On Leave")
        onLeave++;
    });

    const total = present + absent + late + onLeave;

    const attendancePercentage =
      total > 0
        ? Math.round(
            ((present + late) / total) * 100
          )
        : 0;

    return {
      present,
      absent,
      late,
      onLeave,
      total,
      attendancePercentage,
    };
  }, [attendanceRecords]);

  const departmentData = useMemo(() => {
    return departments.map((department) => {
      const departmentEmployees =
        employees.filter(
          (employee) =>
            employee.department === department
        );

      const activeCount =
        departmentEmployees.filter(
          (employee) =>
            employee.status?.toLowerCase() ===
            "active"
        ).length;

      return {
        name: department,
        employees: departmentEmployees.length,
        active: activeCount,
      };
    });
  }, [employees, departments]);

  const attendanceChartData = [
    {
      name: "Present",
      value: attendanceStats.present,
    },
    {
      name: "Absent",
      value: attendanceStats.absent,
    },
    {
      name: "Late",
      value: attendanceStats.late,
    },
    {
      name: "On Leave",
      value: attendanceStats.onLeave,
    },
  ].filter((item) => item.value > 0);

  const leaveStatusData = [
    {
      name: "Pending",
      value: pendingLeaves,
    },
    {
      name: "Approved",
      value: approvedLeaves,
    },
    {
      name: "Rejected",
      value: leaves.filter(
        (leave) => leave.status === "Rejected"
      ).length,
    },
  ].filter((item) => item.value > 0);

  const leaveTypeData = useMemo(() => {
    const typeMap = {};

    leaves.forEach((leave) => {
      typeMap[leave.type] =
        (typeMap[leave.type] || 0) + 1;
    });

    return Object.entries(typeMap).map(
      ([name, requests]) => ({
        name,
        requests,
      })
    );
  }, [leaves]);

  const employeeDistribution = useMemo(() => {
    if (totalEmployees === 0) return [];

    return departmentData.map((item) => ({
      ...item,
      percentage: Math.round(
        (item.employees / totalEmployees) * 100
      ),
    }));
  }, [departmentData, totalEmployees]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="analytics-tooltip">
        {label && (
          <div className="tooltip-label">
            {label}
          </div>
        )}

        {payload.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="tooltip-row"
          >
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <LoadingSpinner message="Loading analytics..." />
    );
  }

  return (
    <div className="analytics-page">
      <style>
        {`
          .analytics-page {
            color: #172033;
            animation: analyticsPageIn 0.55s ease;
          }

          @keyframes analyticsPageIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .analytics-hero {
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

          .analytics-hero::before {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            right: -55px;
            top: -90px;
            background: rgba(255,255,255,0.08);
            animation: analyticsOrb 5s ease-in-out infinite;
          }

          .analytics-hero::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            right: 130px;
            bottom: -65px;
            background: rgba(255,255,255,0.06);
            animation: analyticsOrb 4s ease-in-out infinite reverse;
          }

          @keyframes analyticsOrb {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(12px);
            }
          }

          .analytics-hero-content {
            position: relative;
            z-index: 2;
          }

          .analytics-hero-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: rgba(255,255,255,0.16);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            height: 100%;
            transition:
              transform 0.28s ease,
              box-shadow 0.28s ease;
            animation: kpiIn 0.5s ease backwards;
          }

          .kpi-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 18px 35px rgba(31,41,55,0.10);
          }

          .kpi-card:nth-child(1) {
            animation-delay: 0.05s;
          }

          .kpi-card:nth-child(2) {
            animation-delay: 0.1s;
          }

          .kpi-card:nth-child(3) {
            animation-delay: 0.15s;
          }

          .kpi-card:nth-child(4) {
            animation-delay: 0.2s;
          }

          @keyframes kpiIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .kpi-icon {
            width: 48px;
            height: 48px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .kpi-indigo {
            background: #EEF2FF;
            color: #6366F1;
          }

          .kpi-green {
            background: #ECFDF5;
            color: #10B981;
          }

          .kpi-blue {
            background: #EFF6FF;
            color: #3B82F6;
          }

          .kpi-orange {
            background: #FFF7ED;
            color: #F97316;
          }

          .trend-pill {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 8px;
            border-radius: 999px;
            background: #ECFDF5;
            color: #047857;
            font-size: 10px;
            font-weight: 800;
          }

          .chart-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            overflow: hidden;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.05);
            height: 100%;
            animation: chartCardIn 0.6s ease backwards;
          }

          .chart-card:nth-child(1) {
            animation-delay: 0.15s;
          }

          .chart-card:nth-child(2) {
            animation-delay: 0.2s;
          }

          .chart-card:nth-child(3) {
            animation-delay: 0.25s;
          }

          .chart-card:nth-child(4) {
            animation-delay: 0.3s;
          }

          @keyframes chartCardIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .chart-header {
            padding: 20px 22px;
            border-bottom: 1px solid #F0F1F6;
          }

          .chart-title-icon {
            width: 38px;
            height: 38px;
            border-radius: 11px;
            background: #EEF2FF;
            color: #6366F1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .chart-body {
            padding: 18px;
          }

          .chart-container {
            width: 100%;
            height: 300px;
          }

          .analytics-tooltip {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 10px 13px;
            box-shadow:
              0 12px 30px rgba(15,23,42,0.12);
            min-width: 120px;
          }

          .tooltip-label {
            font-size: 11px;
            font-weight: 800;
            color: #374151;
            margin-bottom: 6px;
          }

          .tooltip-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            font-size: 11px;
            color: #6B7280;
            margin-top: 4px;
          }

          .tooltip-row strong {
            color: #4F46E5;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 11px;
            color: #6B7280;
            font-weight: 600;
          }

          .legend-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .summary-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            padding: 22px;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.05);
            animation: chartCardIn 0.6s ease 0.35s backwards;
          }

          .summary-progress {
            height: 8px;
            width: 100%;
            background: #EEF0F7;
            border-radius: 99px;
            overflow: hidden;
          }

          .summary-progress-fill {
            height: 100%;
            border-radius: 99px;
            background:
              linear-gradient(
                90deg,
                #6366F1,
                #8B5CF6
              );
            transition: width 0.9s ease;
          }

          .distribution-row {
            margin-bottom: 18px;
          }

          .distribution-row:last-child {
            margin-bottom: 0;
          }

          .distribution-icon {
            width: 35px;
            height: 35px;
            border-radius: 10px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 800;
          }

          .attendance-center {
            position: relative;
          }

          .attendance-center-label {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            pointer-events: none;
          }

          .attendance-center-value {
            font-size: 25px;
            font-weight: 800;
            color: #4F46E5;
          }

          .attendance-center-text {
            font-size: 9px;
            color: #6B7280;
            font-weight: 700;
          }

          .empty-chart {
            height: 280px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #9CA3AF;
          }

          .empty-chart-icon {
            width: 55px;
            height: 55px;
            border-radius: 17px;
            background: #F5F3FF;
            color: #A5B4FC;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media (max-width: 767px) {
            .analytics-hero {
              padding: 22px;
              border-radius: 20px;
            }

            .analytics-hero h1 {
              font-size: 23px !important;
            }

            .analytics-hero-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
            }

            .chart-card,
            .summary-card {
              border-radius: 18px;
            }

            .chart-header {
              padding: 17px;
            }

            .chart-body {
              padding: 10px;
            }

            .chart-container {
              height: 270px;
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

      {/* HERO */}
      <div className="analytics-hero mb-4">
        <div className="analytics-hero-content">
          <div className="d-flex align-items-center gap-3">
            <div className="analytics-hero-icon">
              <FaChartLine size={25} />
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
                Business Intelligence
              </div>

              <h1
                className="fw-bold mb-1"
                style={{ fontSize: "30px" }}
              >
                Analytics Dashboard
              </h1>

              <p
                className="mb-0"
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                  fontSize: "14px",
                }}
              >
                Understand workforce trends,
                attendance and leave activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Total Employees
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "30px",
                  }}
                >
                  {totalEmployees}
                </div>

                <div className="mt-2">
                  <span className="trend-pill">
                    <FaArrowUp size={8} />
                    Workforce
                  </span>
                </div>
              </div>

              <div className="kpi-icon kpi-indigo">
                <FaUsers size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Active Workforce
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "30px",
                    color: "#059669",
                  }}
                >
                  {activeEmployees}
                </div>

                <div className="mt-2">
                  <span className="trend-pill">
                    <FaUserCheck size={9} />
                    Active
                  </span>
                </div>
              </div>

              <div className="kpi-icon kpi-green">
                <FaUserCheck size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Departments
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "30px",
                    color: "#2563EB",
                  }}
                >
                  {totalDepartments}
                </div>

                <div className="mt-2">
                  <span className="trend-pill">
                    <FaBuilding size={9} />
                    Teams
                  </span>
                </div>
              </div>

              <div className="kpi-icon kpi-blue">
                <FaBuilding size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="small text-muted fw-semibold mb-2">
                  Leave Requests
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "30px",
                    color: "#EA580C",
                  }}
                >
                  {totalLeaveRequests}
                </div>

                <div className="mt-2">
                  <span className="trend-pill">
                    <FaUmbrellaBeach size={9} />
                    Requests
                  </span>
                </div>
              </div>

              <div className="kpi-icon kpi-orange">
                <FaUmbrellaBeach size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHART ROW 1 */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-7">
          <div className="chart-card">
            <div className="chart-header">
              <div className="d-flex align-items-center gap-3">
                <div className="chart-title-icon">
                  <FaChartBar size={16} />
                </div>

                <div>
                  <h6 className="fw-bold mb-1">
                    Department Workforce
                  </h6>

                  <div className="small text-muted">
                    Employee distribution by department
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-body">
              {departmentData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={departmentData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -15,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#EEF0F7"
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 11,
                          fill: "#6B7280",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fontSize: 10,
                          fill: "#9CA3AF",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        content={<CustomTooltip />}
                      />

                      <Bar
                        dataKey="employees"
                        name="Employees"
                        fill="#6366F1"
                        radius={[
                          8,
                          8,
                          0,
                          0,
                        ]}
                        animationDuration={1000}
                      />

                      <Bar
                        dataKey="active"
                        name="Active"
                        fill="#10B981"
                        radius={[
                          8,
                          8,
                          0,
                          0,
                        ]}
                        animationDuration={1200}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <div className="empty-chart-icon">
                    <FaChartBar size={20} />
                  </div>

                  <div className="fw-semibold mt-3">
                    No department data
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="chart-card">
            <div className="chart-header">
              <div className="d-flex align-items-center gap-3">
                <div className="chart-title-icon">
                  <FaCalendarCheck size={16} />
                </div>

                <div>
                  <h6 className="fw-bold mb-1">
                    Attendance Overview
                  </h6>

                  <div className="small text-muted">
                    Recorded attendance distribution
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-body">
              {attendanceChartData.length > 0 ? (
                <div className="attendance-center">
                  <div className="chart-container">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={
                            attendanceChartData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={105}
                          paddingAngle={4}
                          animationDuration={1000}
                        >
                          {attendanceChartData.map(
                            (entry, index) => (
                              <Cell
                                key={`attendance-${index}`}
                                fill={
                                  CHART_COLORS[
                                    index %
                                      CHART_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "11px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="attendance-center-label">
                    <div className="attendance-center-value">
                      {
                        attendanceStats
                          .attendancePercentage
                      }
                      %
                    </div>

                    <div className="attendance-center-text">
                      Attendance
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-chart">
                  <div className="empty-chart-icon">
                    <FaCalendarCheck size={20} />
                  </div>

                  <div className="fw-semibold mt-3">
                    No attendance data
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CHART ROW 2 */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="chart-card">
            <div className="chart-header">
              <div className="d-flex align-items-center gap-3">
                <div className="chart-title-icon">
                  <FaChartPie size={16} />
                </div>

                <div>
                  <h6 className="fw-bold mb-1">
                    Leave Status
                  </h6>

                  <div className="small text-muted">
                    Current leave request status
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-body">
              {leaveStatusData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={leaveStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        outerRadius={105}
                        innerRadius={48}
                        paddingAngle={4}
                        animationDuration={1000}
                      >
                        {leaveStatusData.map(
                          (entry, index) => (
                            <Cell
                              key={`leave-status-${index}`}
                              fill={
                                [
                                  "#F97316",
                                  "#10B981",
                                  "#EF4444",
                                ][index]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <CustomTooltip />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <div className="empty-chart-icon">
                    <FaUmbrellaBeach size={20} />
                  </div>

                  <div className="fw-semibold mt-3">
                    No leave data
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="chart-card">
            <div className="chart-header">
              <div className="d-flex align-items-center gap-3">
                <div className="chart-title-icon">
                  <FaChartBar size={16} />
                </div>

                <div>
                  <h6 className="fw-bold mb-1">
                    Leave Type Analysis
                  </h6>

                  <div className="small text-muted">
                    Requests by leave category
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-body">
              {leaveTypeData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={leaveTypeData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 20,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#EEF0F7"
                      />

                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{
                          fontSize: 10,
                          fill: "#9CA3AF",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        type="category"
                        dataKey="name"
                        width={75}
                        tick={{
                          fontSize: 10,
                          fill: "#6B7280",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        content={<CustomTooltip />}
                      />

                      <Bar
                        dataKey="requests"
                        name="Requests"
                        fill="#8B5CF6"
                        radius={[
                          0,
                          8,
                          8,
                          0,
                        ]}
                        animationDuration={1100}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <div className="empty-chart-icon">
                    <FaChartBar size={20} />
                  </div>

                  <div className="fw-semibold mt-3">
                    No leave type data
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WORKFORCE SUMMARY */}
      <div className="summary-card mb-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="chart-title-icon">
            <FaUsers size={16} />
          </div>

          <div>
            <h6 className="fw-bold mb-1">
              Workforce Distribution
            </h6>

            <div className="small text-muted">
              Department-wise employee distribution
            </div>
          </div>
        </div>

        {employeeDistribution.length === 0 ? (
          <div className="text-center text-muted py-4">
            No employee data available.
          </div>
        ) : (
          <div className="row g-4">
            {employeeDistribution.map(
              (department, index) => (
                <div
                  className="col-12 col-md-6"
                  key={department.name}
                >
                  <div className="distribution-row">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="distribution-icon"
                          style={{
                            background:
                              `linear-gradient(135deg, ${CHART_COLORS[index % CHART_COLORS.length]}, #8B5CF6)`,
                          }}
                        >
                          {department.name.slice(
                            0,
                            2
                          )}
                        </div>

                        <div>
                          <div className="fw-bold">
                            {department.name}
                          </div>

                          <div className="small text-muted">
                            {department.employees}{" "}
                            employees
                          </div>
                        </div>
                      </div>

                      <div
                        className="fw-bold"
                        style={{
                          color: "#6366F1",
                        }}
                      >
                        {department.percentage}%
                      </div>
                    </div>

                    <div className="summary-progress">
                      <div
                        className="summary-progress-fill"
                        style={{
                          width: `${department.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* QUICK INSIGHTS */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="summary-card h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="kpi-icon kpi-green">
                <FaUserCheck size={18} />
              </div>

              <div>
                <div className="fw-bold">
                  Active Rate
                </div>

                <div className="small text-muted">
                  Current workforce
                </div>
              </div>
            </div>

            <div
              className="fw-bold"
              style={{
                fontSize: "32px",
                color: "#059669",
              }}
            >
              {totalEmployees > 0
                ? Math.round(
                    (activeEmployees /
                      totalEmployees) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="summary-card h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="kpi-icon kpi-indigo">
                <FaCalendarCheck size={18} />
              </div>

              <div>
                <div className="fw-bold">
                  Attendance Rate
                </div>

                <div className="small text-muted">
                  Recorded attendance
                </div>
              </div>
            </div>

            <div
              className="fw-bold"
              style={{
                fontSize: "32px",
                color: "#6366F1",
              }}
            >
              {
                attendanceStats.attendancePercentage
              }
              %
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="summary-card h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="kpi-icon kpi-orange">
                <FaUmbrellaBeach size={18} />
              </div>

              <div>
                <div className="fw-bold">
                  Pending Leaves
                </div>

                <div className="small text-muted">
                  Awaiting approval
                </div>
              </div>
            </div>

            <div
              className="fw-bold"
              style={{
                fontSize: "32px",
                color: "#EA580C",
              }}
            >
              {pendingLeaves}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;