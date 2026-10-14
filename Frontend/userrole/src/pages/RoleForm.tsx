
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface Role {
  id: number;
  name: string;
}

interface RoleFormData {
  id: number;
  name: string;
}

const API_URL = "https://localhost:7033/api/Role";

const emptyForm: RoleFormData = { id: 0, name: "" };

function RoleForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<RoleFormData>({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState<Role | null>(null);

  const getRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<Role[]>(API_URL);
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Get roles error:", err);
      setError("Unable to load roles. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void getRoles();
  }, [getRoles]);

  const openAddModal = () => {
    setFormData({ ...emptyForm });
    setError("");
    setViewRole(null);
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setFormData({ id: role.id, name: role.name ?? "" });
    setError("");
    setViewRole(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setFormData({ ...emptyForm });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (formData.id === 0) {
        await axios.post(API_URL, { name: formData.name.trim() });
      } else {
        await axios.put(API_URL, {
          id: formData.id,
          name: formData.name.trim(),
        });
      }

      setModalOpen(false);
      setFormData({ ...emptyForm });
      await getRoles();
    } catch (err) {
      console.error("Save role error:", err);
      setError("Unable to save role. Please check your API and input.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      await getRoles();
    } catch (err) {
      console.error("Delete role error:", err);
      setError("Unable to delete role.");
    }
  };

  return (
    <div className="roles-page">
      <style>{`
        .roles-page {
          width: 100%;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }
        .roles-page * { box-sizing: border-box; }
        .roles-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }
        .roles-page-title {
          margin: 0;
          font-size: 29px;
          font-weight: 400;
          color: #111827;
        }
        .add-role-button {
          border: none;
          border-radius: 6px;
          padding: 11px 16px;
          background: #198754;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          white-space: nowrap;
        }
        .add-role-button:hover { background: #157347; }
        .roles-table-wrapper { width: 100%; overflow-x: auto; }
        .roles-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          font-size: 16px;
        }
        .roles-table th {
          padding: 13px 10px;
          background: #212529;
          color: #fff;
          text-align: left;
          font-weight: 700;
          border: 1px solid #495057;
        }
        .roles-table td {
          padding: 12px 10px;
          border: 1px solid #d8dee4;
          color: #111827;
          background: #fff;
          text-align: left;
          vertical-align: middle;
        }
        .roles-table tbody tr:hover td { background: #f8fafc; }
        .roles-table .id-column { width: 80px; }
        .roles-table .actions-column { width: 190px; }
        .role-actions { display: flex; align-items: center; gap: 10px; }
        .role-icon-button {
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
        .role-view-action, .role-edit-action { color: #111; }
        .role-delete-action { color: #ff0000; }
        .role-icon-button:hover { opacity: .65; }
        .roles-message {
          padding: 22px;
          text-align: center;
          background: white;
          border: 1px solid #d8dee4;
        }
        .roles-error {
          margin-bottom: 15px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 5px;
          background: #fee2e2;
          color: #991b1b;
        }
        .role-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, .45);
        }
        .role-modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 35px rgba(0,0,0,.2);
        }
        .role-modal-title {
          margin: 0 0 20px;
          font-size: 23px;
          color: #212529;
        }
        .role-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 16px;
        }
        .role-form-group label { font-size: 14px; font-weight: 600; }
        .role-form-group input {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-size: 15px;
          outline: none;
        }
        .role-form-group input:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 3px rgba(13,110,253,.15);
        }
        .role-modal-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        .role-modal-button {
          border: none;
          border-radius: 5px;
          padding: 10px 17px;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }
        .role-modal-save { background: #198754; }
        .role-modal-cancel { background: #6c757d; }
        .role-view-detail {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          overflow-wrap: anywhere;
        }
        .role-view-detail strong {
          display: inline-block;
          min-width: 90px;
        }
        @media (max-width: 600px) {
          .roles-page-title { font-size: 24px; }
          .roles-table { min-width: 400px; }
          .role-modal { padding: 18px; }
        }
      `}</style>

      <div className="roles-page-header">
        <h1 className="roles-page-title">Roles List</h1>
        <button type="button" className="add-role-button" onClick={openAddModal}>
          <span aria-hidden="true">＋</span> Add Role
        </button>
      </div>

      {error && <div className="roles-error">{error}</div>}

      {loading ? (
        <div className="roles-message">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="roles-message">No roles found.</div>
      ) : (
        <div className="roles-table-wrapper">
          <table className="roles-table">
            <thead>
              <tr>
                <th className="id-column">ID</th>
                <th>Role Name</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <div className="role-actions">
                      <button
                        type="button"
                        className="role-icon-button role-view-action"
                        title="View role"
                        aria-label={`View ${role.name}`}
                        onClick={() => setViewRole(role)}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 5c-5.5 0-9.7 5.1-10 7 .3 1.9 4.5 7 10 7s9.7-5.1 10-7c-.3-1.9-4.5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="role-icon-button role-edit-action"
                        title="Edit role"
                        aria-label={`Edit ${role.name}`}
                        onClick={() => openEditModal(role)}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66zM5 19v-1l9.06-9.06 1 1L6 19H5z" />
                          <path d="M19 19H9v2h10a2 2 0 0 0 2-2V9h-2v10z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="role-icon-button role-delete-action"
                        title="Delete role"
                        aria-label={`Delete ${role.name}`}
                        onClick={() => void handleDelete(role.id)}
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
          className="role-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="role-modal" role="dialog" aria-modal="true" aria-labelledby="role-modal-heading">
            <h2 id="role-modal-heading" className="role-modal-title">
              {formData.id === 0 ? "Add Role" : "Edit Role"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="role-form-group">
                <label htmlFor="role-name">Role Name</label>
                <input
                  id="role-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div className="role-modal-actions">
                <button type="button" className="role-modal-button role-modal-cancel" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="role-modal-button role-modal-save" disabled={saving}>
                  {saving ? "Saving..." : formData.id === 0 ? "Add Role" : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewRole && (
        <div
          className="role-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewRole(null);
          }}
        >
          <div className="role-modal" role="dialog" aria-modal="true" aria-labelledby="view-role-heading">
            <h2 id="view-role-heading" className="role-modal-title">Role Details</h2>
            <div className="role-view-detail"><strong>ID:</strong> {viewRole.id}</div>
            <div className="role-view-detail"><strong>Role Name:</strong> {viewRole.name}</div>
            <div className="role-modal-actions">
              <button type="button" className="role-modal-button role-modal-cancel" onClick={() => setViewRole(null)}>
                Close
              </button>
              <button type="button" className="role-modal-button role-modal-save" onClick={() => openEditModal(viewRole)}>
                Edit Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleForm;
