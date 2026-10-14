
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserRole {
  id: number;
  userId: number;
  roleId: number;
}

interface UserRoleFormData {
  id: number;
  userId: number;
  roleId: number;
}

const API_URL = "https://localhost:7033/api/UserRole";
const USER_API_URL = "https://localhost:7033/api/User";
const ROLE_API_URL = "https://localhost:7033/api/Role";

const emptyForm: UserRoleFormData = {
  id: 0,
  userId: 0,
  roleId: 0,
};

function UserRoleForm() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<UserRoleFormData>({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUserRole, setViewUserRole] = useState<UserRole | null>(null);

  const getData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [userRoleResponse, userResponse, roleResponse] = await Promise.all([
        axios.get<UserRole[]>(API_URL),
        axios.get<User[]>(USER_API_URL),
        axios.get<Role[]>(ROLE_API_URL),
      ]);

      setUserRoles(
        Array.isArray(userRoleResponse.data) ? userRoleResponse.data : []
      );
      setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
      setRoles(Array.isArray(roleResponse.data) ? roleResponse.data : []);
    } catch (err) {
      console.error("Get user roles error:", err);
      setError("Unable to load user roles. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void getData();
  }, [getData]);

  const getUserName = (userId: number) =>
    users.find((user) => user.id === userId)?.name ?? `User ${userId}`;

  const getRoleName = (roleId: number) =>
    roles.find((role) => role.id === roleId)?.name ?? `Role ${roleId}`;

  const openAddModal = () => {
    setFormData({ ...emptyForm });
    setError("");
    setViewUserRole(null);
    setModalOpen(true);
  };

  const openEditModal = (userRole: UserRole) => {
    setFormData({
      id: userRole.id,
      userId: userRole.userId,
      roleId: userRole.roleId,
    });
    setError("");
    setViewUserRole(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setFormData({ ...emptyForm });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formData.userId === 0 || formData.roleId === 0) {
      setError("Please select both a user and a role.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (formData.id === 0) {
        await axios.post(API_URL, {
          userId: formData.userId,
          roleId: formData.roleId,
        });
      } else {
        await axios.put(API_URL, {
          id: formData.id,
          userId: formData.userId,
          roleId: formData.roleId,
        });
      }

      setModalOpen(false);
      setFormData({ ...emptyForm });
      await getData();
    } catch (err) {
      console.error("Save user role error:", err);
      setError("Unable to save user role. Please check your API and input.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user role assignment?"
      )
    ) {
      return;
    }

    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      await getData();
    } catch (err) {
      console.error("Delete user role error:", err);
      setError("Unable to delete user role assignment.");
    }
  };

  return (
    <div className="user-roles-page">
      <style>{`
        .user-roles-page {
          width: 100%;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }
        .user-roles-page * { box-sizing: border-box; }
        .user-roles-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }
        .user-roles-page-title {
          margin: 0;
          font-size: 29px;
          font-weight: 400;
          color: #111827;
        }
        .add-user-role-button {
          border: none;
          border-radius: 6px;
          padding: 11px 16px;
          background: #198754;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          white-space: nowrap;
        }
        .add-user-role-button:hover { background: #157347; }
        .user-roles-table-wrapper { width: 100%; overflow-x: auto; }
        .user-roles-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          font-size: 16px;
        }
        .user-roles-table th {
          padding: 13px 10px;
          background: #212529;
          color: #fff;
          text-align: left;
          font-weight: 700;
          border: 1px solid #495057;
        }
        .user-roles-table td {
          padding: 12px 10px;
          border: 1px solid #d8dee4;
          color: #111827;
          background: #fff;
          text-align: left;
          vertical-align: middle;
        }
        .user-roles-table tbody tr:hover td { background: #f8fafc; }
        .user-roles-table .id-column { width: 65px; }
        .user-roles-table .actions-column { width: 160px; }
        .user-role-actions { display: flex; align-items: center; gap: 10px; }
        .user-role-icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          padding: 0;
          background: transparent;
          cursor: pointer;
          font-size: 19px;
          line-height: 1;
        }
        .user-role-view-action, .user-role-edit-action { color: #111; }
        .user-role-delete-action { color: #ff0000; }
        .user-role-icon-button:hover { opacity: .65; }
        .user-roles-message {
          padding: 22px;
          text-align: center;
          background: white;
          border: 1px solid #d8dee4;
        }
        .user-roles-error {
          margin-bottom: 15px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 5px;
          background: #fee2e2;
          color: #991b1b;
        }
        .user-role-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, .45);
        }
        .user-role-modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 35px rgba(0,0,0,.2);
        }
        .user-role-modal-title {
          margin: 0 0 20px;
          font-size: 23px;
          color: #212529;
        }
        .user-role-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 16px;
        }
        .user-role-form-group label {
          font-size: 14px;
          font-weight: 600;
        }
        .user-role-form-group select {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          background: #fff;
          font-size: 15px;
          outline: none;
        }
        .user-role-form-group select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 3px rgba(13,110,253,.15);
        }
        .user-role-modal-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        .user-role-modal-button {
          border: none;
          border-radius: 5px;
          padding: 10px 17px;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }
        .user-role-modal-save { background: #198754; }
        .user-role-modal-cancel { background: #6c757d; }
        .user-role-view-detail {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          overflow-wrap: anywhere;
        }
        .user-role-view-detail strong {
          display: inline-block;
          min-width: 90px;
        }
        @media (max-width: 600px) {
          .user-roles-page-title { font-size: 24px; }
          .user-roles-table { min-width: 560px; }
          .user-role-modal { padding: 18px; }
        }
      `}</style>

      <div className="user-roles-page-header">
        <h1 className="user-roles-page-title">User Roles List</h1>
        <button
          type="button"
          className="add-user-role-button"
          onClick={openAddModal}
        >
          <span aria-hidden="true">＋</span> Assign Role
        </button>
      </div>

      {error && <div className="user-roles-error">{error}</div>}

      {loading ? (
        <div className="user-roles-message">Loading user roles...</div>
      ) : userRoles.length === 0 ? (
        <div className="user-roles-message">No user roles found.</div>
      ) : (
        <div className="user-roles-table-wrapper">
          <table className="user-roles-table">
            <thead>
              <tr>
                <th className="id-column">ID</th>
                <th>User Name</th>
                <th>Role Name</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((userRole) => (
                <tr key={userRole.id}>
                  <td>{userRole.id}</td>
                  <td>{getUserName(userRole.userId)}</td>
                  <td>{getRoleName(userRole.roleId)}</td>
                  <td>
                    <div className="user-role-actions">
                      <button
                        type="button"
                        className="user-role-icon-button user-role-view-action"
                        title="View assignment"
                        aria-label={`View assignment ${userRole.id}`}
                        onClick={() => setViewUserRole(userRole)}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 5c-5.5 0-9.7 5.1-10 7 .3 1.9 4.5 7 10 7s9.7-5.1 10-7c-.3-1.9-4.5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="user-role-icon-button user-role-edit-action"
                        title="Edit assignment"
                        aria-label={`Edit assignment ${userRole.id}`}
                        onClick={() => openEditModal(userRole)}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66zM5 19v-1l9.06-9.06 1 1L6 19H5z" />
                          <path d="M19 19H9v2h10a2 2 0 0 0 2-2V9h-2v10z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="user-role-icon-button user-role-delete-action"
                        title="Delete assignment"
                        aria-label={`Delete assignment ${userRole.id}`}
                        onClick={() => void handleDelete(userRole.id)}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div
          className="user-role-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="user-role-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-role-modal-heading"
          >
            <h2 id="user-role-modal-heading" className="user-role-modal-title">
              {formData.id === 0 ? "Assign Role" : "Edit User Role"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="user-role-form-group">
                <label htmlFor="user-role-user">User</label>
                <select
                  id="user-role-user"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                >
                  <option value={0}>Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-role-form-group">
                <label htmlFor="user-role-role">Role</label>
                <select
                  id="user-role-role"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  required
                >
                  <option value={0}>Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-role-modal-actions">
                <button
                  type="button"
                  className="user-role-modal-button user-role-modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="user-role-modal-button user-role-modal-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : formData.id === 0
                    ? "Assign Role"
                    : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewUserRole && (
        <div
          className="user-role-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewUserRole(null);
          }}
        >
          <div
            className="user-role-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-user-role-heading"
          >
            <h2 id="view-user-role-heading" className="user-role-modal-title">
              User Role Details
            </h2>

            <div className="user-role-view-detail">
              <strong>ID:</strong> {viewUserRole.id}
            </div>
            <div className="user-role-view-detail">
              <strong>User:</strong> {getUserName(viewUserRole.userId)}
            </div>
            <div className="user-role-view-detail">
              <strong>Role:</strong> {getRoleName(viewUserRole.roleId)}
            </div>

            <div className="user-role-modal-actions">
              <button
                type="button"
                className="user-role-modal-button user-role-modal-cancel"
                onClick={() => setViewUserRole(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="user-role-modal-button user-role-modal-save"
                onClick={() => openEditModal(viewUserRole)}
              >
                Edit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRoleForm;
