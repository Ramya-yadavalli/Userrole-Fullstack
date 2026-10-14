
import { Navigate } from "react-router-dom";

export default function DefaultDashboardRedirect() {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    const role = String(user.role ?? "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "_");

    const defaultPages: Record<string, string> = {
      super_admin: "/dashboardlayout/user",
      admin: "/dashboardlayout/employees",
      employee: "/dashboardlayout/apply-jobs",
      employer: "/dashboardlayout/post-jobs",
    };

    const destination = defaultPages[role];

    if (!destination) {
      return (
        <div style={{ padding: 20 }}>
          No dashboard page is configured for this role.
        </div>
      );
    }

    return <Navigate to={destination} replace />;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return <Navigate to="/" replace />;
  }
}
