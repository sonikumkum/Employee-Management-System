// STEP 45: Premium Animated Dashboard UI

import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaCalendarCheck,
  FaUmbrellaBeach,
  FaUserTimes,
  FaBuilding,
  FaClock,
  FaCheckCircle,
  FaBriefcase,
  FaArrowRight,
  FaUserCircle,
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

import { Link } from "react-router-dom";

import { getCurrentUser } from "../utils/auth";
import { getEmployees } from "../utils/helpers";
import employeesData from "../data/employees";

const ATTENDANCE_KEY =
  "employee_management_system_attendance";

const LEAVES_KEY =
  "employee_management_system_leaves";

const CHART_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
];

function getToday() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Dashboard() {
  const currentUser = getCurrentUser();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = getToday();

  const isEmployee =
    currentUser?.role === "Employee";

  useEffect(() => {
    const loadData = () => {
      setEmployees(getEmployees(employeesData));

      try {
        const attendanceData =
          localStorage.getItem(ATTENDANCE_KEY);

        const leavesData =
          localStorage.getItem(LEAVES_KEY);

        setAttendance(
          attendanceData
            ? JSON.parse(attendanceData)
            : []
        );

        setLeaves(
          leavesData
            ? JSON.parse(leavesData)
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 350);
      }
    };

    loadData();
  }, []);

  const employeeProfile = useMemo(() => {
    if (!currentUser?.employeeId) {
      return null;
    }

    return employees.find(
      (employee) =>
        employee.id === currentUser.employeeId
    );
  }, [employees, currentUser]);

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active"
  );

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  const todayAttendance = attendance.filter(
    (record) => record.date === today
  );

  const presentToday = todayAttendance.filter(
    (record) =>
      record.status === "Present" ||
      record.status === "Late"
  );

  const absentToday = todayAttendance.filter(
    (record) =>
      record.status === "Absent"
  );

  const onLeaveToday = todayAttendance.filter(
    (record) =>
      record.status === "On Leave"
  );

  const pendingLeaves = leaves.filter(
    (leave) =>
      leave.status === "Pending"
  );

  const approvedLeaves = leaves.filter(
    (leave) =>
      leave.status === "Approved"
  );

  const rejectedLeaves = leaves.filter(
    (leave) =>
      leave.status === "Rejected"
  );

  const departmentChartData =
    departments.map((department) => ({
      name: department,
      employees: employees.filter(
        (employee) =>
          employee.department === department
      ).length,
    }));

  const attendanceChartData = [
    {
      name: "Present",
      value: presentToday.length,
    },
    {
      name: "Absent",
      value: absentToday.length,
    },
    {
      name: "On Leave",
      value: onLeaveToday.length,
    },
  ].filter((item) => item.value > 0);

  const leaveChartData = [
    {
      name: "Pending",
      value: pendingLeaves.length,
    },
    {
      name: "Approved",
      value: approvedLeaves.length,
    },
    {
      name: "Rejected",
      value: rejectedLeaves.length,
    },
  ].filter((item) => item.value > 0);

  const employeeAttendance =
    attendance.find(
      (record) =>
        record.employeeId ===
          currentUser?.employeeId &&
        record.date === today
    );

  const employeeLeaves = leaves.filter(
    (leave) =>
      leave.employeeId ===
      currentUser?.employeeId
  );

  const employeePendingLeaves =
    employeeLeaves.filter(
      (leave) =>
        leave.status === "Pending"
    ).length;

  const employeeApprovedLeaves =
    employeeLeaves.filter(
      (leave) =>
        leave.status === "Approved"
    ).length;

  if (loading) {
    return (
      <>
        <style>{dashboardStyles}</style>

        <div className="premium-loader">
          <div className="loader-ring"></div>
          <div className="loader-text">
            Loading your dashboard...
          </div>
        </div>
      </>
    );
  }

  if (isEmployee) {
    return (
      <>
        <style>{dashboardStyles}</style>

        <EmployeeDashboard
          currentUser={currentUser}
          employee={employeeProfile}
          attendance={employeeAttendance}
          pendingLeaves={employeePendingLeaves}
          approvedLeaves={employeeApprovedLeaves}
          today={today}
        />
      </>
    );
  }

  return (
    <>
      <style>{dashboardStyles}</style>

      <div className="premium-dashboard">

        {/* WELCOME */}

        <section className="hero-banner">

          <div className="hero-orb hero-orb-one"></div>
          <div className="hero-orb hero-orb-two"></div>

          <div className="hero-content">

            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Live Dashboard
            </div>

            <h1>
              Welcome back,{" "}
              {currentUser?.name || "Admin"} 👋
            </h1>

            <p>
              Here's what's happening across
              your organization today.
            </p>

            <div className="hero-date">
              <FaCalendarCheck />
              {formatDate(today)}
            </div>

          </div>

        </section>

        {/* KPI */}

        <div className="row g-4 mb-4">

          <KpiCard
            title="Total Employees"
            value={employees.length}
            subtitle="Workforce size"
            icon={<FaUsers />}
            className="kpi-blue"
          />

          <KpiCard
            title="Active Employees"
            value={activeEmployees.length}
            subtitle="Currently active"
            icon={<FaUserCheck />}
            className="kpi-green"
          />

          <KpiCard
            title="Present Today"
            value={presentToday.length}
            subtitle="Present + Late"
            icon={<FaCalendarCheck />}
            className="kpi-purple"
          />

          <KpiCard
            title="On Leave"
            value={onLeaveToday.length}
            subtitle="Today's leave"
            icon={<FaUmbrellaBeach />}
            className="kpi-orange"
          />

        </div>

        {/* QUICK STATS */}

        <div className="row g-4 mb-4">

          <SummaryCard
            label="Absent Today"
            value={absentToday.length}
            icon={<FaUserTimes />}
            color="red"
          />

          <SummaryCard
            label="Pending Leaves"
            value={pendingLeaves.length}
            icon={<FaClock />}
            color="orange"
          />

          <SummaryCard
            label="Departments"
            value={departments.length}
            icon={<FaBuilding />}
            color="blue"
          />

        </div>

        {/* CHARTS */}

        <div className="row g-4 mb-4">

          <div className="col-12 col-xl-7">

            <ChartCard
              title="Workforce by Department"
              subtitle="Employee distribution"
              icon={<FaBuilding />}
            >

              {departmentChartData.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={departmentChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#eef0f6"
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill: "rgba(99,102,241,.05)",
                      }}
                      contentStyle={{
                        border: "none",
                        borderRadius: "12px",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,.1)",
                      }}
                    />

                    <Bar
                      dataKey="employees"
                      fill="#6366f1"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      barSize={42}
                      animationDuration={1200}
                    />

                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}

            </ChartCard>

          </div>

          <div className="col-12 col-xl-5">

            <ChartCard
              title="Today's Attendance"
              subtitle="Attendance overview"
              icon={<FaCalendarCheck />}
            >

              {attendanceChartData.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={attendanceChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={4}
                      animationDuration={1200}
                    >

                      {attendanceChartData.map(
                        (item, index) => (
                          <Cell
                            key={item.name}
                            fill={
                              CHART_COLORS[
                                index
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                    />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart
                  message="No attendance marked today"
                />
              )}

            </ChartCard>

          </div>

        </div>

        {/* LOWER SECTION */}

        <div className="row g-4">

          {/* RECENT EMPLOYEES */}

          <div className="col-12 col-xl-7">

            <div className="premium-card">

              <CardHeader
                title="Recent Employees"
                subtitle="Latest workforce records"
                icon={<FaUsers />}
                action={
                  <Link
                    to="/employees"
                    className="view-all-btn"
                  >
                    View All
                    <FaArrowRight />
                  </Link>
                }
              />

              <div className="table-responsive">

                <table className="table premium-table mb-0">

                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {employees
                      .slice(-5)
                      .reverse()
                      .map((employee) => (
                        <tr key={employee.id}>

                          <td>
                            <div className="employee-cell">

                              <div className="employee-avatar">
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
                            {employee.department ||
                              "—"}
                          </td>

                          <td>
                            <span
                              className={
                                employee.status ===
                                "Active"
                                  ? "status-active"
                                  : "status-inactive"
                              }
                            >
                              <span></span>
                              {employee.status}
                            </span>
                          </td>

                        </tr>
                      ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* LEAVE OVERVIEW */}

          <div className="col-12 col-xl-5">

            <ChartCard
              title="Leave Overview"
              subtitle="Current leave requests"
              icon={<FaUmbrellaBeach />}
            >

              {leaveChartData.length ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={leaveChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={88}
                      paddingAngle={4}
                      animationDuration={1300}
                    >

                      {leaveChartData.map(
                        (item, index) => (
                          <Cell
                            key={item.name}
                            fill={
                              CHART_COLORS[
                                index + 1
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                    />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart
                  message="No leave requests yet"
                />
              )}

            </ChartCard>

          </div>

        </div>

      </div>
    </>
  );
}

/* =====================================================
   EMPLOYEE DASHBOARD
===================================================== */

function EmployeeDashboard({
  currentUser,
  employee,
  attendance,
  pendingLeaves,
  approvedLeaves,
  today,
}) {
  const name =
    employee?.name ||
    currentUser?.name ||
    "Employee";

  return (
    <div className="premium-dashboard">

      <section className="hero-banner">

        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>

        <div className="hero-content">

          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Employee Portal
          </div>

          <h1>
            Welcome, {name} 👋
          </h1>

          <p>
            Here's your personal employee
            dashboard.
          </p>

          <div className="hero-date">
            <FaCalendarCheck />
            {formatDate(today)}
          </div>

        </div>

      </section>

      {/* PROFILE */}

      <div className="profile-hero-card mb-4">

        <div className="profile-gradient">

          <div className="profile-avatar">
            {getInitials(name)}
          </div>

          <div className="profile-main">

            <h2>{name}</h2>

            <p>
              {employee?.designation ||
                "Employee"}
            </p>

            <small>
              {employee?.department ||
                "Department"}{" "}
              •{" "}
              {employee?.id ||
                currentUser?.employeeId}
            </small>

          </div>

          <span className="active-pill">
            <span></span>
            {employee?.status || "Active"}
          </span>

        </div>

      </div>

      {/* PERSONAL STATS */}

      <div className="row g-4 mb-4">

        <EmployeeStat
          title="Today's Attendance"
          value={
            attendance?.status ||
            "Not Marked"
          }
          subtitle="Current status"
          icon={<FaCalendarCheck />}
          color="blue"
        />

        <EmployeeStat
          title="Pending Leaves"
          value={pendingLeaves}
          subtitle="Awaiting approval"
          icon={<FaClock />}
          color="orange"
        />

        <EmployeeStat
          title="Approved Leaves"
          value={approvedLeaves}
          subtitle="Approved requests"
          icon={<FaCheckCircle />}
          color="green"
        />

      </div>

      <div className="row g-4">

        {/* EMPLOYMENT */}

        <div className="col-12 col-lg-7">

          <div className="premium-card">

            <CardHeader
              title="Employment Information"
              subtitle="Your current employment details"
              icon={<FaBriefcase />}
            />

            <div className="info-list">

              <InfoRow
                label="Employee ID"
                value={
                  employee?.id ||
                  currentUser?.employeeId ||
                  "—"
                }
              />

              <InfoRow
                label="Email"
                value={
                  employee?.email ||
                  currentUser?.email ||
                  "—"
                }
              />

              <InfoRow
                label="Department"
                value={
                  employee?.department ||
                  "—"
                }
              />

              <InfoRow
                label="Designation"
                value={
                  employee?.designation ||
                  "—"
                }
              />

              <InfoRow
                label="Joining Date"
                value={
                  employee?.joiningDate ||
                  "—"
                }
              />

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="col-12 col-lg-5">

          <div className="premium-card">

            <CardHeader
              title="Quick Actions"
              subtitle="Manage your account"
              icon={<FaUserCircle />}
            />

            <div className="quick-actions">

              <QuickAction
                to="/attendance"
                title="Attendance"
                text="View your attendance"
                icon={<FaCalendarCheck />}
              />

              <QuickAction
                to="/leaves"
                title="Leave Management"
                text="Apply or track leave"
                icon={<FaUmbrellaBeach />}
              />

              <QuickAction
                to="/profile"
                title="My Profile"
                text="View your profile"
                icon={<FaUserCircle />}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  className,
}) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">

      <div className={`kpi-card ${className}`}>

        <div className="kpi-top">

          <div className="kpi-icon">
            {icon}
          </div>

          <div className="kpi-shine"></div>

        </div>

        <div className="kpi-title">
          {title}
        </div>

        <div className="kpi-value">
          {value}
        </div>

        <div className="kpi-subtitle">
          {subtitle}
        </div>

      </div>

    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}) {
  return (
    <div className="col-12 col-md-4">

      <div className={`summary-card summary-${color}`}>

        <div className="summary-icon">
          {icon}
        </div>

        <div>
          <div className="summary-label">
            {label}
          </div>

          <div className="summary-value">
            {value}
          </div>
        </div>

      </div>

    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  icon,
  children,
}) {
  return (
    <div className="premium-card chart-card">

      <CardHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
      />

      <div className="chart-body">
        {children}
      </div>

    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  icon,
  action,
}) {
  return (
    <div className="card-header-premium">

      <div className="d-flex align-items-center gap-3">

        <div className="header-icon">
          {icon}
        </div>

        <div>

          <h5>{title}</h5>

          <small>
            {subtitle}
          </small>

        </div>

      </div>

      {action}

    </div>
  );
}

function EmployeeStat({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  return (
    <div className="col-12 col-md-4">

      <div className={`employee-stat employee-${color}`}>

        <div className="employee-stat-icon">
          {icon}
        </div>

        <div className="employee-stat-title">
          {title}
        </div>

        <div className="employee-stat-value">
          {value}
        </div>

        <div className="employee-stat-subtitle">
          {subtitle}
        </div>

      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="info-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}

function QuickAction({
  to,
  title,
  text,
  icon,
}) {
  return (
    <Link
      to={to}
      className="quick-action"
    >

      <div className="quick-action-icon">
        {icon}
      </div>

      <div className="quick-action-text">

        <strong>{title}</strong>

        <small>{text}</small>

      </div>

      <FaArrowRight className="quick-arrow" />

    </Link>
  );
}

function EmptyChart({
  message = "No data available",
}) {
  return (
    <div className="empty-chart">

      <FaBuilding />

      <span>{message}</span>

    </div>
  );
}

/* =====================================================
   PREMIUM CSS
===================================================== */

const dashboardStyles = `

.premium-dashboard {
  width: 100%;
  animation: dashboardFade .55s ease both;
}

@keyframes dashboardFade {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ================= HERO ================= */

.hero-banner {
  position: relative;
  overflow: hidden;
  min-height: 205px;
  border-radius: 22px;
  padding: 30px;
  margin-bottom: 26px;
  background:
    linear-gradient(
      135deg,
      #4f46e5 0%,
      #6366f1 45%,
      #8b5cf6 100%
    );
  box-shadow:
    0 15px 40px rgba(99,102,241,.20);
  color: white;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.hero-banner h1 {
  font-size: 28px;
  font-weight: 750;
  margin: 16px 0 7px;
}

.hero-banner p {
  margin: 0;
  opacity: .86;
  font-size: 14px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 30px;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.15);
  font-size: 11px;
  backdrop-filter: blur(8px);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 5px rgba(52,211,153,.12);
  animation: pulseDot 1.8s infinite;
}

@keyframes pulseDot {
  0%,100% {
    box-shadow: 0 0 0 4px rgba(52,211,153,.12);
  }

  50% {
    box-shadow: 0 0 0 9px rgba(52,211,153,0);
  }
}

.hero-date {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 8px 13px;
  border-radius: 30px;
  background: rgba(255,255,255,.12);
  font-size: 11px;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  animation: floatOrb 6s ease-in-out infinite;
}

.hero-orb-one {
  width: 260px;
  height: 260px;
  right: -80px;
  top: -120px;
}

.hero-orb-two {
  width: 150px;
  height: 150px;
  right: 180px;
  bottom: -90px;
  animation-delay: 1.5s;
}

@keyframes floatOrb {
  0%,100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-14px) rotate(8deg);
  }
}

/* ================= KPI ================= */

.kpi-card {
  position: relative;
  overflow: hidden;
  min-height: 178px;
  padding: 21px;
  border-radius: 18px;
  background: white;
  border: 1px solid rgba(0,0,0,.035);
  box-shadow: 0 7px 25px rgba(20,30,50,.06);
  transition:
    transform .3s ease,
    box-shadow .3s ease;
  animation: cardEnter .6s ease both;
}

.kpi-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 18px 38px rgba(20,30,50,.11);
}

.kpi-card::after {
  content: "";
  position: absolute;
  width: 90px;
  height: 90px;
  right: -30px;
  bottom: -35px;
  border-radius: 50%;
  opacity: .09;
}

.kpi-blue::after {
  background: #6366f1;
}

.kpi-green::after {
  background: #10b981;
}

.kpi-purple::after {
  background: #8b5cf6;
}

.kpi-orange::after {
  background: #f59e0b;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 17px;
}

.kpi-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  animation: iconFloat 3s ease-in-out infinite;
}

.kpi-blue .kpi-icon {
  background: #eef2ff;
  color: #6366f1;
}

.kpi-green .kpi-icon {
  background: #ecfdf5;
  color: #10b981;
}

.kpi-purple .kpi-icon {
  background: #f5f3ff;
  color: #8b5cf6;
}

.kpi-orange .kpi-icon {
  background: #fffbeb;
  color: #f59e0b;
}

@keyframes iconFloat {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

.kpi-title {
  font-size: 11px;
  color: #7b8494;
  font-weight: 650;
}

.kpi-value {
  font-size: 29px;
  line-height: 1;
  font-weight: 800;
  color: #172033;
  margin-top: 7px;
}

.kpi-subtitle {
  font-size: 11px;
  color: #9aa2b1;
  margin-top: 9px;
}

/* ================= SUMMARY ================= */

.summary-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 6px 22px rgba(20,30,50,.055);
  transition: .25s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.summary-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-red .summary-icon {
  background: #fff1f2;
  color: #ef4444;
}

.summary-orange .summary-icon {
  background: #fff7ed;
  color: #f59e0b;
}

.summary-blue .summary-icon {
  background: #eef2ff;
  color: #6366f1;
}

.summary-label {
  color: #7b8494;
  font-size: 11px;
}

.summary-value {
  font-size: 22px;
  font-weight: 750;
  margin-top: 3px;
}

/* ================= CARD ================= */

.premium-card {
  height: 100%;
  overflow: hidden;
  border-radius: 18px;
  background: white;
  border: 1px solid rgba(0,0,0,.035);
  box-shadow: 0 7px 25px rgba(20,30,50,.055);
  transition: box-shadow .3s ease;
}

.premium-card:hover {
  box-shadow: 0 13px 32px rgba(20,30,50,.085);
}

.card-header-premium {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f2f6;
}

.header-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #eef2ff;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header-premium h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 750;
  color: #20283a;
}

.card-header-premium small {
  color: #9aa2b1;
  font-size: 10px;
}

.chart-card {
  min-height: 370px;
}

.chart-body {
  height: 305px;
  padding: 15px;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 650;
  color: #6366f1;
  padding: 7px 11px;
  border-radius: 9px;
  background: #eef2ff;
  transition: .2s ease;
}

.view-all-btn:hover {
  color: white;
  background: #6366f1;
}

/* ================= TABLE ================= */

.premium-table th {
  padding: 13px 18px;
  border-bottom: 1px solid #edf0f5;
  color: #9aa2b1;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.premium-table td {
  padding: 14px 18px;
  font-size: 12px;
  border-bottom: 1px solid #f4f5f7;
  vertical-align: middle;
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}

.employee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(
    135deg,
    #6366f1,
    #8b5cf6
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 750;
}

.employee-name {
  font-weight: 650;
  color: #283044;
}

.employee-id {
  color: #a0a7b5;
  font-size: 10px;
  margin-top: 2px;
}

.status-active,
.status-inactive {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 650;
}

.status-active {
  background: #ecfdf5;
  color: #059669;
}

.status-inactive {
  background: #fff1f2;
  color: #dc2626;
}

.status-active span,
.status-inactive span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

/* ================= EMPLOYEE ================= */

.profile-hero-card {
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(30,40,80,.08);
}

.profile-gradient {
  min-height: 170px;
  padding: 27px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #6366f1,
      #8b5cf6
    );
  position: relative;
  overflow: hidden;
}

.profile-gradient::after {
  content: "";
  position: absolute;
  width: 210px;
  height: 210px;
  right: -70px;
  top: -100px;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  animation: floatOrb 6s ease-in-out infinite;
}

.profile-avatar {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 21px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  font-weight: 750;
  backdrop-filter: blur(8px);
}

.profile-main {
  position: relative;
  z-index: 2;
}

.profile-main h2 {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 750;
}

.profile-main p {
  margin: 0 0 5px;
  opacity: .85;
  font-size: 13px;
}

.profile-main small {
  opacity: .72;
}

.active-pill {
  position: relative;
  z-index: 2;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,.14);
  font-size: 10px;
}

.active-pill span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
}

/* ================= EMPLOYEE STATS ================= */

.employee-stat {
  padding: 21px;
  border-radius: 17px;
  background: white;
  box-shadow: 0 7px 25px rgba(20,30,50,.055);
  transition: .25s ease;
}

.employee-stat:hover {
  transform: translateY(-5px);
}

.employee-stat-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.employee-blue .employee-stat-icon {
  background: #eef2ff;
  color: #6366f1;
}

.employee-orange .employee-stat-icon {
  background: #fff7ed;
  color: #f59e0b;
}

.employee-green .employee-stat-icon {
  background: #ecfdf5;
  color: #10b981;
}

.employee-stat-title {
  font-size: 11px;
  color: #7b8494;
  font-weight: 650;
}

.employee-stat-value {
  font-size: 22px;
  font-weight: 750;
  margin-top: 5px;
}

.employee-stat-subtitle {
  color: #a0a7b5;
  font-size: 10px;
  margin-top: 5px;
}

/* ================= INFO ================= */

.info-list {
  padding: 8px 20px 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f2f6;
}

.info-row:last-child {
  border-bottom: 0;
}

.info-row span {
  color: #8992a3;
  font-size: 11px;
}

.info-row strong {
  color: #283044;
  font-size: 11px;
}

/* ================= ACTIONS ================= */

.quick-actions {
  padding: 14px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  margin-bottom: 8px;
  border-radius: 13px;
  text-decoration: none;
  color: #283044;
  background: #f8f9fc;
  transition: all .25s ease;
}

.quick-action:hover {
  color: #6366f1;
  background: #eef2ff;
  transform: translateX(5px);
}

.quick-action-icon {
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 11px;
  background: white;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-text {
  flex: 1;
}

.quick-action-text strong {
  display: block;
  font-size: 11px;
}

.quick-action-text small {
  color: #9aa2b1;
  font-size: 9px;
}

.quick-arrow {
  font-size: 10px;
  color: #9aa2b1;
}

/* ================= EMPTY ================= */

.empty-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #a5adba;
  font-size: 11px;
}

.empty-chart svg {
  font-size: 28px;
}

/* ================= LOADER ================= */

.premium-loader {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-ring {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 4px solid #e0e7ff;
  border-top-color: #6366f1;
  animation: spin .8s linear infinite;
}

.loader-text {
  margin-top: 14px;
  color: #7b8494;
  font-size: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= MOBILE ================= */

@media (max-width: 767px) {

  .hero-banner {
    min-height: 190px;
    padding: 23px;
    border-radius: 17px;
  }

  .hero-banner h1 {
    font-size: 21px;
  }

  .profile-gradient {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 22px;
  }

  .active-pill {
    margin-left: 0;
  }

  .chart-card {
    min-height: 340px;
  }

  .chart-body {
    height: 275px;
  }

  .premium-table {
    min-width: 600px;
  }

}

@media (prefers-reduced-motion: reduce) {

  .premium-dashboard *,
  .premium-dashboard *::before,
  .premium-dashboard *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }

}
`;

export default Dashboard;