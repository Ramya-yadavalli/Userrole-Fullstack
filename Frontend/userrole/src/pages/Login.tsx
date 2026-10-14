
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onClose?: () => void;
}

function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7033/api/Auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      // Normalize role values, e.g. "Super Admin" -> "super_admin"
      const roleValue = String(data.role ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "_");

      const roleAliases: Record<string, string> = {
        super_admin: "super_admin",
        superadmin: "super_admin",
        admin: "admin",
        employee: "employee",
        employer: "employer",
      };

      const normalizedRole = roleAliases[roleValue] ?? roleValue;

      const allowedRoles = [
        "super_admin",
        "admin",
        "employee",
        "employer",
      ];

      if (!data.token) {
        setError(
          "Login response does not contain an authentication token."
        );
        return;
      }

      if (!allowedRoles.includes(normalizedRole)) {
        setError(`Unsupported role: ${data.role ?? "not provided"}`);
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user details and normalized role
      localStorage.setItem(
        "user",
        JSON.stringify({
          name:
            data.name ??
            data.userName ??
            data.username ??
            data.fullName ??
            "",
          email: data.email ?? email,
          role: normalizedRole,
        })
      );

      // Close popup and navigate to dashboard
      onClose?.();
      navigate("/dashboardlayout", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            err.response?.data?.title ??
            "Invalid email or password. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.55);
        }

        .login-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 35px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          animation: loginPopup 0.25s ease-out;
        }

        .login-modal h2 {
          margin-bottom: 8px;
          text-align: center;
          font-size: 27px;
          font-weight: 700;
          color: #222;
        }

        .login-subtitle {
          margin-bottom: 28px;
          text-align: center;
          color: #777;
          font-size: 14px;
        }

        .login-close {
          position: absolute;
          top: 10px;
          right: 15px;
          border: none;
          background: transparent;
          color: #777;
          font-size: 28px;
          cursor: pointer;
        }

        .login-close:hover {
          color: #dc3545;
        }

        .login-modal .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .login-modal .form-control {
          box-sizing: border-box;
          width: 100%;
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        .login-modal .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.12);
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-submit {
          width: 100%;
          min-height: 46px;
          border: none;
          border-radius: 8px;
          background: #0d6efd;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-submit:hover {
          background: #0b5ed7;
        }

        .login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-error {
          margin: 0 0 16px;
          color: #dc3545;
          font-size: 14px;
        }

        @keyframes loginPopup {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .login-modal {
            padding: 30px 22px;
          }
        }
      `}</style>

      <div className="login-overlay" onClick={onClose}>
        <div
          className="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-heading"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button
              type="button"
              className="login-close"
              onClick={onClose}
              aria-label="Close login"
            >
              ×
            </button>
          )}

          <h2 id="login-heading">Welcome Back!</h2>

          <p className="login-subtitle">
            Please login to your account
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
