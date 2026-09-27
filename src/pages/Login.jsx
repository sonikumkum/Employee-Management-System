// STEP 43: Login Page with Demo Credentials

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
} from "react-icons/fa";

import users from "../data/users";
import { loginUser } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = loginUser(
        formData.email,
        formData.password,
        users
      );

      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }

      navigate("/dashboard", {
        replace: true,
      });

      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      style={{
        padding: "20px",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "430px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* ================= LOGO ================= */}

          <div className="text-center mb-4">

            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              <FaUserShield size={30} />
            </div>

            <h2 className="fw-bold mb-1">
              Employee Management
            </h2>

            <p className="text-muted mb-0">
              Sign in to your account
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div
              className="alert alert-danger py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Email Address
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaEnvelope className="text-muted" />
                </span>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Password
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaLock className="text-muted" />
                </span>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />

                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In
                </>
              )}

            </button>

          </form>

          {/* ================= DEMO CREDENTIALS ================= */}

          <div className="mt-4">

            <div className="alert alert-light border mb-0">

              <h6 className="fw-bold mb-3 text-center">
                Demo Credentials
              </h6>

              <div className="small text-muted">

                {/* ADMIN */}

                <div className="mb-2">
                  <strong className="text-dark">
                    Admin:
                  </strong>{" "}
                  admin@ems.com / admin123
                </div>

                {/* HR */}

                <div className="mb-2">
                  <strong className="text-dark">
                    HR:
                  </strong>{" "}
                  hr@ems.com / hr123
                </div>

                {/* EMPLOYEE */}

                <div className="mb-2">
                  <strong className="text-dark">
                    Employee:
                  </strong>{" "}
                  employee@ems.com / employee123
                </div>

                {/* KUMKUM */}

                <div>
                  <strong className="text-dark">
                    Kumkum:
                  </strong>{" "}
                  sonikumkum18@ems.com / soni123
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;