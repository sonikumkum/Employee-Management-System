import { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaUsers,
  FaUserCheck,
  FaSearch,
  FaChartPie,
  FaBriefcase,
  FaChevronRight,
} from "react-icons/fa";

import { getEmployees } from "../utils/helpers";
import employeesData from "../data/employees";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

function Departments() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const departmentsConfig = [
    {
      name: "IT",
      description:
        "Technology, software development and technical operations.",
      head: "Technology Team",
      icon: "IT",
    },
    {
      name: "HR",
      description:
        "People management, recruitment and employee relations.",
      head: "Human Resources",
      icon: "HR",
    },
    {
      name: "Finance",
      description:
        "Financial planning, accounting and business reporting.",
      head: "Finance Team",
      icon: "FN",
    },
    {
      name: "Marketing",
      description:
        "Brand strategy, campaigns and customer engagement.",
      head: "Marketing Team",
      icon: "MK",
    },
    {
      name: "Sales",
      description:
        "Sales operations, client relationships and revenue growth.",
      head: "Sales Team",
      icon: "SL",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedEmployees = getEmployees(employeesData);
      setEmployees(storedEmployees);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const departmentData = useMemo(() => {
    return departmentsConfig.map((department) => {
      const departmentEmployees = employees.filter(
        (employee) =>
          employee.department?.toLowerCase() ===
          department.name.toLowerCase()
      );

      const activeEmployees = departmentEmployees.filter(
        (employee) =>
          employee.status?.toLowerCase() === "active"
      );

      return {
        ...department,
        employeeCount: departmentEmployees.length,
        activeCount: activeEmployees.length,
      };
    });
  }, [employees]);

  const filteredDepartments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return departmentData;

    return departmentData.filter(
      (department) =>
        department.name.toLowerCase().includes(search) ||
        department.description
          .toLowerCase()
          .includes(search) ||
        department.head.toLowerCase().includes(search)
    );
  }, [departmentData, searchTerm]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status?.toLowerCase() === "active"
  ).length;

  const totalDepartments = departmentData.length;

  const departmentWithMostEmployees =
    departmentData.reduce(
      (largest, current) =>
        current.employeeCount > largest.employeeCount
          ? current
          : largest,
      departmentData[0] || {
        name: "—",
        employeeCount: 0,
      }
    );

  const getDepartmentGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #4F46E5, #8B5CF6)",
      "linear-gradient(135deg, #0891B2, #3B82F6)",
      "linear-gradient(135deg, #059669, #14B8A6)",
      "linear-gradient(135deg, #DB2777, #8B5CF6)",
      "linear-gradient(135deg, #EA580C, #F59E0B)",
    ];

    return gradients[index % gradients.length];
  };

  const getDepartmentIcon = (name) => {
    const icons = {
      IT: "IT",
      HR: "HR",
      Finance: "FN",
      Marketing: "MK",
      Sales: "SL",
    };

    return icons[name] || "DP";
  };

  if (loading) {
    return <LoadingSpinner message="Loading departments..." />;
  }

  return (
    <div className="departments-page">
      <style>
        {`
          .departments-page {
            animation: departmentPageIn 0.55s ease;
            color: #172033;
          }

          @keyframes departmentPageIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .department-hero {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            padding: 28px;
            color: white;
            background:
              radial-gradient(
                circle at 88% 18%,
                rgba(255,255,255,0.18),
                transparent 24%
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

          .department-hero::before {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            right: -60px;
            top: -90px;
            background: rgba(255,255,255,0.08);
            animation: departmentOrb 5s ease-in-out infinite;
          }

          .department-hero::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            right: 130px;
            bottom: -65px;
            background: rgba(255,255,255,0.06);
            animation: departmentOrb 4s ease-in-out infinite reverse;
          }

          @keyframes departmentOrb {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(12px);
            }
          }

          .department-hero-content {
            position: relative;
            z-index: 2;
          }

          .department-hero-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.16);
            backdrop-filter: blur(8px);
          }

          .summary-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            height: 100%;
            transition:
              transform 0.28s ease,
              box-shadow 0.28s ease;
            animation: summaryIn 0.5s ease backwards;
          }

          .summary-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 18px 35px rgba(31,41,55,0.10);
          }

          .summary-card:nth-child(1) {
            animation-delay: 0.05s;
          }

          .summary-card:nth-child(2) {
            animation-delay: 0.1s;
          }

          .summary-card:nth-child(3) {
            animation-delay: 0.15s;
          }

          .summary-card:nth-child(4) {
            animation-delay: 0.2s;
          }

          @keyframes summaryIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .summary-icon {
            width: 48px;
            height: 48px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .summary-icon.indigo {
            background: #EEF2FF;
            color: #6366F1;
          }

          .summary-icon.green {
            background: #ECFDF5;
            color: #10B981;
          }

          .summary-icon.blue {
            background: #EFF6FF;
            color: #3B82F6;
          }

          .summary-icon.orange {
            background: #FFF7ED;
            color: #F97316;
          }

          .department-search-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(31,41,55,0.04);
            animation: summaryIn 0.55s ease 0.15s backwards;
          }

          .department-search {
            position: relative;
          }

          .department-search svg {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #9CA3AF;
            z-index: 2;
          }

          .department-search input {
            min-height: 47px;
            padding-left: 43px;
            border: 1px solid #E5E7EB;
            border-radius: 13px;
            box-shadow: none;
            transition: all 0.2s ease;
          }

          .department-search input:focus {
            border-color: #818CF8;
            box-shadow:
              0 0 0 4px rgba(99,102,241,0.10);
          }

          .department-card {
            position: relative;
            overflow: hidden;
            height: 100%;
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            padding: 22px;
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease,
              border-color 0.3s ease;
            animation: departmentCardIn 0.55s ease backwards;
          }

          .department-card:hover {
            transform: translateY(-7px);
            border-color: #E0E7FF;
            box-shadow:
              0 20px 40px rgba(31,41,55,0.10);
          }

          .department-card::before {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            right: -45px;
            top: -45px;
            background: #F5F3FF;
            transition: transform 0.3s ease;
          }

          .department-card:hover::before {
            transform: scale(1.25);
          }

          .department-card:nth-child(1) {
            animation-delay: 0.05s;
          }

          .department-card:nth-child(2) {
            animation-delay: 0.1s;
          }

          .department-card:nth-child(3) {
            animation-delay: 0.15s;
          }

          .department-card:nth-child(4) {
            animation-delay: 0.2s;
          }

          .department-card:nth-child(5) {
            animation-delay: 0.25s;
          }

          @keyframes departmentCardIn {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .department-symbol {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.04em;
            box-shadow: 0 8px 18px rgba(79,70,229,0.18);
            position: relative;
            z-index: 2;
          }

          .department-name {
            font-size: 18px;
            font-weight: 800;
            color: #1F2937;
          }

          .department-description {
            color: #6B7280;
            font-size: 13px;
            line-height: 1.65;
            min-height: 43px;
          }

          .department-metric {
            background: #F8F9FC;
            border-radius: 14px;
            padding: 13px;
            transition: background 0.2s ease;
          }

          .department-card:hover .department-metric {
            background: #F5F3FF;
          }

          .progress-track {
            width: 100%;
            height: 7px;
            background: #EEF0F7;
            border-radius: 99px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            border-radius: 99px;
            background: linear-gradient(
              90deg,
              #6366F1,
              #8B5CF6
            );
            transition: width 0.8s ease;
          }

          .workforce-card {
            background: white;
            border: 1px solid #EEF0F7;
            border-radius: 22px;
            overflow: hidden;
            box-shadow:
              0 10px 30px rgba(31,41,55,0.05);
            animation: summaryIn 0.6s ease 0.2s backwards;
          }

          .workforce-header {
            padding: 20px 22px;
            border-bottom: 1px solid #F0F1F6;
          }

          .workforce-table {
            margin: 0;
          }

          .workforce-table thead th {
            background: #FAFAFD;
            color: #6B7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 800;
            padding: 14px 18px;
            border-bottom: 1px solid #EEF0F7;
          }

          .workforce-table tbody td {
            padding: 16px 18px;
            border-color: #F1F2F6;
            vertical-align: middle;
          }

          .workforce-table tbody tr {
            transition: background 0.2s ease;
          }

          .workforce-table tbody tr:hover {
            background: #F8F9FF;
          }

          .mini-department-icon {
            width: 36px;
            height: 36px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 9px;
            font-weight: 800;
          }

          .active-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 9px;
            border-radius: 999px;
            background: #ECFDF5;
            color: #047857;
            font-size: 11px;
            font-weight: 800;
          }

          .active-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            animation: activePulse 1.8s ease-in-out infinite;
          }

          @keyframes activePulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(16,185,129,0.35);
            }
            50% {
              box-shadow: 0 0 0 5px rgba(16,185,129,0);
            }
          }

          .share-badge {
            display: inline-block;
            min-width: 55px;
            text-align: center;
            padding: 5px 8px;
            border-radius: 8px;
            background: #EEF2FF;
            color: #6366F1;
            font-size: 11px;
            font-weight: 800;
          }

          @media (max-width: 767px) {
            .department-hero {
              padding: 22px;
              border-radius: 20px;
            }

            .department-hero h1 {
              font-size: 23px !important;
            }

            .department-hero-icon {
              width: 48px;
              height: 48px;
              border-radius: 14px;
            }

            .department-search-card {
              padding: 16px;
              border-radius: 18px;
            }

            .department-card {
              border-radius: 18px;
              padding: 18px;
            }

            .workforce-card {
              border-radius: 18px;
            }

            .workforce-table-wrapper {
              overflow-x: auto;
            }

            .workforce-table {
              min-width: 700px;
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
      <div className="department-hero mb-4">
        <div className="department-hero-content">
          <div className="d-flex align-items-center gap-3">
            <div className="department-hero-icon">
              <FaBuilding size={25} />
            </div>

            <div>
              <div
                className="small mb-1"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 600,
                }}
              >
                Organization Structure
              </div>

              <h1
                className="fw-bold mb-1"
                style={{ fontSize: "30px" }}
              >
                Departments
              </h1>

              <p
                className="mb-0"
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "14px",
                }}
              >
                Explore teams, workforce distribution and
                department performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="summary-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small fw-semibold mb-2">
                  Total Departments
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#4F46E5",
                  }}
                >
                  {totalDepartments}
                </div>

                <div className="small text-muted mt-1">
                  Organization units
                </div>
              </div>

              <div className="summary-icon indigo">
                <FaBuilding size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="summary-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small fw-semibold mb-2">
                  Total Employees
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "29px",
                    color: "#2563EB",
                  }}
                >
                  {totalEmployees}
                </div>

                <div className="small text-muted mt-1">
                  Across all teams
                </div>
              </div>

              <div className="summary-icon blue">
                <FaUsers size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="summary-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small fw-semibold mb-2">
                  Active Workforce
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

              <div className="summary-icon green">
                <FaUserCheck size={19} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="summary-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small fw-semibold mb-2">
                  Largest Department
                </div>

                <div
                  className="fw-bold text-truncate"
                  style={{
                    fontSize: "22px",
                    color: "#EA580C",
                    maxWidth: "145px",
                  }}
                >
                  {departmentWithMostEmployees.name}
                </div>

                <div className="small text-muted mt-1">
                  {departmentWithMostEmployees.employeeCount}{" "}
                  employees
                </div>
              </div>

              <div className="summary-icon orange">
                <FaChartPie size={19} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="department-search-card mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <FaSearch
            size={14}
            style={{ color: "#6366F1" }}
          />

          <div>
            <div className="fw-bold">
              Find Department
            </div>

            <div
              className="small text-muted"
              style={{ fontSize: "11px" }}
            >
              Search by department or team
            </div>
          </div>
        </div>

        <div className="department-search">
          <FaSearch size={14} />

          <input
            type="text"
            className="form-control"
            placeholder="Search department..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
      </div>

      {/* DEPARTMENT CARDS */}
      {filteredDepartments.length === 0 ? (
        <div className="bg-white rounded-4 border p-5">
          <EmptyState
            title="No departments found"
            message="Try changing your search keyword."
            actionText="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-1">
                Department Overview
              </h5>

              <div className="small text-muted">
                {filteredDepartments.length} departments
                displayed
              </div>
            </div>

            <div
              className="d-flex align-items-center gap-2"
              style={{
                fontSize: "12px",
                color: "#6366F1",
                fontWeight: 700,
              }}
            >
              <FaBriefcase size={12} />
              Workforce
            </div>
          </div>

          <div className="row g-3 mb-4">
            {filteredDepartments.map(
              (department, index) => {
                const workforceShare =
                  totalEmployees > 0
                    ? Math.round(
                        (department.employeeCount /
                          totalEmployees) *
                          100
                      )
                    : 0;

                const activePercentage =
                  department.employeeCount > 0
                    ? Math.round(
                        (department.activeCount /
                          department.employeeCount) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="col-12 col-md-6 col-xl-4"
                    key={department.name}
                  >
                    <div className="department-card">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="department-symbol"
                          style={{
                            background:
                              getDepartmentGradient(
                                index
                              ),
                          }}
                        >
                          {getDepartmentIcon(
                            department.name
                          )}
                        </div>

                        <div
                          style={{
                            color: "#9CA3AF",
                          }}
                        >
                          <FaChevronRight size={13} />
                        </div>
                      </div>

                      <div className="department-name mb-2">
                        {department.name}
                      </div>

                      <div className="department-description mb-3">
                        {department.description}
                      </div>

                      <div className="department-metric mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className="small text-muted fw-semibold"
                          >
                            Workforce Share
                          </span>

                          <span className="share-badge">
                            {workforceShare}%
                          </span>
                        </div>

                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${workforceShare}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="row g-2">
                        <div className="col-6">
                          <div
                            className="p-2 rounded-3"
                            style={{
                              background: "#F8F9FC",
                            }}
                          >
                            <div className="small text-muted">
                              Employees
                            </div>

                            <div
                              className="fw-bold mt-1"
                              style={{
                                color: "#4F46E5",
                              }}
                            >
                              {department.employeeCount}
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div
                            className="p-2 rounded-3"
                            style={{
                              background: "#F8F9FC",
                            }}
                          >
                            <div className="small text-muted">
                              Active
                            </div>

                            <div
                              className="fw-bold mt-1"
                              style={{
                                color: "#059669",
                              }}
                            >
                              {department.activeCount}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className="small text-muted"
                          >
                            Active Workforce
                          </span>

                          <span
                            className="small fw-bold"
                            style={{
                              color: "#059669",
                            }}
                          >
                            {activePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}

      {/* WORKFORCE TABLE */}
      <div className="workforce-card">
        <div className="workforce-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-1">
                Workforce Distribution
              </h5>

              <div className="small text-muted">
                Employee distribution across departments
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
              <FaChartPie size={12} />
              Overview
            </div>
          </div>
        </div>

        <div className="workforce-table-wrapper">
          <table className="table workforce-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>Active</th>
                <th>Workforce Share</th>
                <th>Active Rate</th>
              </tr>
            </thead>

            <tbody>
              {departmentData.map(
                (department, index) => {
                  const workforceShare =
                    totalEmployees > 0
                      ? Math.round(
                          (department.employeeCount /
                            totalEmployees) *
                            100
                        )
                      : 0;

                  const activeRate =
                    department.employeeCount > 0
                      ? Math.round(
                          (department.activeCount /
                            department.employeeCount) *
                            100
                        )
                      : 0;

                  return (
                    <tr key={department.name}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="mini-department-icon"
                            style={{
                              background:
                                getDepartmentGradient(
                                  index
                                ),
                            }}
                          >
                            {department.icon}
                          </div>

                          <div>
                            <div className="fw-bold">
                              {department.name}
                            </div>

                            <div
                              className="small text-muted"
                              style={{
                                fontSize: "11px",
                              }}
                            >
                              {department.head}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="fw-bold">
                          {department.employeeCount}
                        </span>
                      </td>

                      <td>
                        <span className="active-pill">
                          <span className="active-dot" />
                          {department.activeCount}
                        </span>
                      </td>

                      <td>
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ minWidth: "150px" }}
                        >
                          <div
                            className="progress-track"
                            style={{
                              flex: 1,
                            }}
                          >
                            <div
                              className="progress-fill"
                              style={{
                                width: `${workforceShare}%`,
                              }}
                            />
                          </div>

                          <span
                            className="small fw-bold"
                            style={{
                              color: "#6366F1",
                              width: "35px",
                            }}
                          >
                            {workforceShare}%
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="fw-bold"
                          style={{
                            color:
                              activeRate >= 80
                                ? "#059669"
                                : activeRate >= 50
                                ? "#D97706"
                                : "#DC2626",
                          }}
                        >
                          {activeRate}%
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Departments;