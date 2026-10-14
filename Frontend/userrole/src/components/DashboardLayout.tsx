
import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface User {
  name?: string;
  userName?: string;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

interface MenuItem {
  label: string;
  path: string;
}

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User>({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!savedUser || !token) {
        navigate("/", { replace: true });
        return;
      }

      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  const role = String(user.role ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const roleMenus: Record<string, MenuItem[]> = {
    super_admin: [
      { label: "Users", path: "/dashboardlayout/user" },
      { label: "Roles", path: "/dashboardlayout/role" },
      { label: "User Role", path: "/dashboardlayout/userrole" },
    ],

    admin: [
      {
        label: "Manage Employee",
        path: "/dashboardlayout/employees",
      },
      {
        label: "Manage Employer",
        path: "/dashboardlayout/employers",
      },
    ],

    employee: [
      {
        label: "Apply Jobs",
        path: "/dashboardlayout/apply-jobs",
      },
      {
        label: "Search Jobs",
        path: "/dashboardlayout/search-jobs",
      },
    ],

    employer: [
      {
        label: "Post Jobs",
        path: "/dashboardlayout/post-jobs",
      },
      {
        label: "Update Posted Jobs",
        path: "/dashboardlayout/posted-jobs",
      },
    ],
  };

  const menuItems = roleMenus[role] ?? [];

  const displayName =
    user.name ||
    user.fullName ||
    user.userName ||
    user.username ||
    user.email ||
    "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser({});
    setMenuOpen(false);

    navigate("/", { replace: true });
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-layout {
          min-height: 100vh;
          background: #ecf0f1;
          font-family: Arial, Helvetica, sans-serif;
        }

        /* Existing navbar preserved */
        .dashboard-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 68px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
          background: #172554;
          color: white;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .dashboard-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 21px;
          font-weight: 700;
          color: white;
          text-decoration: none;
        }

        // .dashboard-brand-icon {
        //   width: 38px;
        //   height: 38px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   border-radius: 10px;
        //   background: #2563eb;
        //   color: white;
        //   font-size: 20px;
        // }

        .dashboard-user-area {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dashboard-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .dashboard-user-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .dashboard-user-role {
          font-size: 12px;
          color: #bfdbfe;
          text-transform: capitalize;
        }

        .dashboard-logout {
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 7px;
          background: #dc2626;
          color: white;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dashboard-logout:hover {
          background: #b91c1c;
        }

        .dashboard-menu-toggle {
          display: none;
          border: none;
          background: transparent;
          color: white;
          font-size: 26px;
          cursor: pointer;
        }

        /* Sidebar styled like your screenshot */
        .dashboard-sidebar {
          position: fixed;
          top: 68px;
          bottom: 0;
          left: 0;
          z-index: 900;
          width: 243px;
          overflow-y: auto;
          padding: 0 23px 24px;
          background: #2c4053;
          border-right: none;
        }

        .dashboard-sidebar-heading {
          margin: 0 -23px 24px;
          padding: 0 23px;
          color: white;
          font-size: 29px;
          font-weight: 700;
          line-height: 35px;
          letter-spacing: 0;
          text-transform: none;
        }

        .dashboard-menu {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .dashboard-menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 5px;
          color: white;
          font-size: 16px;
          font-weight: 400;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .dashboard-menu-link:hover {
          background: #354d64;
          color: white;
        }

        .dashboard-menu-link.active {
          background: #354d64;
          color: white;
          font-weight: 400;
        }

        .dashboard-menu-icon {
          width: 0;
          display: none;
          text-align: center;
          font-size: 17px;
        }

        .dashboard-no-role {
          margin: 12px 0;
          padding: 14px;
          border-radius: 8px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 13px;
          line-height: 1.6;
        }

        .dashboard-main {
          min-height: 100vh;
          margin-left: 243px;
          padding: 82px 33px 30px;
          background: #ecf0f1;
        }

        .dashboard-content {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .dashboard-mobile-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .dashboard-navbar {
            height: 62px;
            padding: 0 14px;
          }

          .dashboard-brand {
            gap: 8px;
            font-size: 17px;
          }

        //   .dashboard-brand-icon {
        //     width: 33px;
        //     height: 33px;
        //     font-size: 17px;
        //   }

          .dashboard-menu-toggle {
            display: block;
          }

          .dashboard-user-info {
            display: none;
          }

          .dashboard-user-area {
            gap: 10px;
          }

          .dashboard-logout {
            padding: 9px 11px;
            font-size: 12px;
          }

          .dashboard-sidebar {
            top: 62px;
            width: 260px;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .dashboard-sidebar.open {
            transform: translateX(0);
          }

          .dashboard-mobile-overlay.show {
            display: block;
            position: fixed;
            inset: 62px 0 0;
            z-index: 850;
            background: rgba(15, 23, 42, 0.45);
          }

          .dashboard-main {
            margin-left: 0;
            padding: 78px 15px 24px;
          }
        }

        @media (max-width: 380px) {
          .dashboard-brand {
            font-size: 14px;
          }

          .dashboard-logout {
            padding: 8px;
          }
        }
      `}</style>

      <div className="dashboard-layout">
        {/* Existing top navbar - preserved */}
        <header className="dashboard-navbar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              type="button"
              className="dashboard-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>

            <Link
              to="/dashboardlayout"
              className="dashboard-brand"
            >
              {/* <span className="dashboard-brand-icon">D</span> */}
              <span>Job Portal</span>
            </Link>
          </div>

          <div className="dashboard-user-area">
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">
                {displayName}
              </span>

              <span className="dashboard-user-role">
                {role.replace(/_/g, " ") || "Not logged in"}
              </span>
            </div>

            <button
              type="button"
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        <div
          className={`dashboard-mobile-overlay ${
            menuOpen ? "show" : ""
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`dashboard-sidebar ${
            menuOpen ? "open" : ""
          }`}
        >
          <h2 className="dashboard-sidebar-heading">
            Dashboard
          </h2>

          <nav className="dashboard-menu">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(
                  `${item.path}/`
                );

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`dashboard-menu-link ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="dashboard-menu-icon">
                    •
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {menuItems.length === 0 && (
            <div className="dashboard-no-role">
              No dashboard menu is available for this account.
              Please log in with a supported role.
            </div>
          )}
        </aside>

        {/* Main page content */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
