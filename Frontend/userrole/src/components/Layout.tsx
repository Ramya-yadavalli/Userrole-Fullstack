
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Login from "../pages/Login";

function Layout() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Do not display the normal website layout on dashboard pages
  if (location.pathname.startsWith("/dashboardlayout")) {
    return <Outlet />;
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-4">
        <div className="container-fluid">
          {/* Shop Name */}
          <Link
            to="/"
            className="navbar-brand fw-bold fs-4 text-dark"
          >
            My Shop
          </Link>

          {/* Navigation Links and Buttons */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link to="/" className="nav-link">
              Home
            </Link>

            <Link to="/about" className="nav-link">
              About
            </Link>

            <Link to="/services" className="nav-link">
              Services
            </Link>

            {/* Login Popup Button */}
            <button
              type="button"
              className="btn btn-outline-primary login-nav-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>

            {/* Google Button */}
            <button
              type="button"
              className="btn btn-outline-danger social-btn"
              aria-label="Google login"
            >
              <FaGoogle size={18} />
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              className="btn btn-outline-primary social-btn"
              aria-label="Facebook login"
            >
              <FaFacebook size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Login Popup */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}

export default Layout;
