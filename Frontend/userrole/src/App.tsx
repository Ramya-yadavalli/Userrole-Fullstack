
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/Home";
import UserForm from "./pages/UserForm";
import RoleForm from "./pages/RoleForm";
import UserRoleForm from "./pages/UserRoleForm";
import DefaultDashboardRedirect from "./components/DefaultDashboardRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Normal website layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<h2>About</h2>} />
          <Route path="/services" element={<h2>Services</h2>} />
        </Route>

        {/* Role-based dashboard layout */}
        <Route
          path="/dashboardlayout"
          element={<DashboardLayout />}
        >
          <Route index element={<DefaultDashboardRedirect />} />

          <Route path="user" element={<UserForm />} />
          <Route path="role" element={<RoleForm />} />
          <Route path="userrole" element={<UserRoleForm />} />

          <Route
            path="employees"
            element={<h2>Manage Employee</h2>}
          />

          <Route
            path="employers"
            element={<h2>Manage Employer</h2>}
          />

          <Route
            path="apply-jobs"
            element={<h2>Apply Jobs</h2>}
          />

          <Route
            path="search-jobs"
            element={<h2>Search Jobs</h2>}
          />

          <Route
            path="post-jobs"
            element={<h2>Post Jobs</h2>}
          />

          <Route
            path="posted-jobs"
            element={<h2>Update Posted Jobs</h2>}
          />
        </Route>

        {/* Unknown routes return to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
