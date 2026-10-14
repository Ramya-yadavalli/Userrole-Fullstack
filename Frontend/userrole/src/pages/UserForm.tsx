
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

interface UserFormData {
  id: number;
  name: string;
  email: string;
  password: string;
}

const API_URL = "https://localhost:7033/api/User";

const emptyForm: UserFormData = {
  id: 0,
  name: "",
  email: "",
  password: "",
};

function UserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    ...emptyForm,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const getUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<User[]>(API_URL);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Get users error:", err);
      setError("Unable to load users. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void getUsers();
  }, [getUsers]);

  const openAddModal = () => {
    setFormData({ ...emptyForm });
    setError("");
    setViewUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
    });

    setError("");
    setViewUser(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setViewUser(null);
    setFormData({ ...emptyForm });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (formData.id === 0) {
        await axios.post(API_URL, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        const payload: {
          id: number;
          name: string;
          email: string;
          password?: string;
        } = {
          id: formData.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
        };

        // Only send a new password if the user entered one.
        if (formData.password.trim()) {
          payload.password = formData.password;
        }

        await axios.put(API_URL, payload);
      }

      setModalOpen(false);
      setFormData({ ...emptyForm });
      await getUsers();
    } catch (err) {
      console.error("Save user error:", err);
      setError("Unable to save user. Please check your API and input.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      await getUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      setError("Unable to delete user.");
    }
  };

  return (
    <div className="users-page">
      <style>{`
        .users-page {
          width: 100%;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        .users-page * {
          box-sizing: border-box;
        }

        .users-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .users-page-title {
          margin: 0;
          font-size: 29px;
          font-weight: 400;
          color: #111827;
        }

        .add-user-button {
          border: none;
          border-radius: 6px;
          padding: 11px 16px;
          background: #198754;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          white-space: nowrap;
        }

        .add-user-button:hover {
          background: #157347;
        }

        .users-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          font-size: 16px;
        }

        .users-table th {
          padding: 13px 10px;
          background: #212529;
          color: #fff;
          text-align: left;
          font-weight: 700;
          border: 1px solid #495057;
        }

        .users-table td {
          padding: 12px 10px;
          border: 1px solid #d8dee4;
          color: #111827;
          background: #fff;
          text-align: left;
          vertical-align: middle;
        }

        .users-table tbody tr:hover td {
          background: #f8fafc;
        }

        .users-table .id-column {
          width: 65px;
        }

        .users-table .name-column {
          width: 150px;
        }

        .users-table .actions-column {
          width: 160px;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-button {
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

        .view-action,
        .edit-action {
          color: #111;
        }

        .delete-action {
          color: #ff0000;
        }

        .icon-button:hover {
          opacity: 0.65;
        }

        .users-message {
          padding: 22px;
          text-align: center;
          background: white;
          border: 1px solid #d8dee4;
        }

        .users-error {
          margin-bottom: 15px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 5px;
          background: #fee2e2;
          color: #991b1b;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.45);
        }

        .user-modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 35px rgba(0,0,0,0.2);
        }

        .user-modal-title {
          margin: 0 0 20px;
          font-size: 23px;
          color: #212529;
        }

        .user-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 16px;
        }

        .user-form-group label {
          font-size: 14px;
          font-weight: 600;
        }

        .user-form-group input {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-size: 15px;
          outline: none;
        }

        .user-form-group input:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 3px rgba(13,110,253,.15);
        }

        .user-modal-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-button {
          border: none;
          border-radius: 5px;
          padding: 10px 17px;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        .modal-save {
          background: #198754;
        }

        .modal-cancel {
          background: #6c757d;
        }

        .view-detail {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          overflow-wrap: anywhere;
        }

        .view-detail strong {
          display: inline-block;
          min-width: 90px;
        }

        @media (max-width: 600px) {
          .users-page-title {
            font-size: 24px;
          }

          .users-table {
            min-width: 560px;
          }

          .user-modal {
            padding: 18px;
          }
        }
      `}</style>

      <div className="users-page-header">
        <h1 className="users-page-title">Users List</h1>

        <button
          type="button"
          className="add-user-button"
          onClick={openAddModal}
        >
          <span aria-hidden="true">＋</span> Add User
        </button>
      </div>

      {error && <div className="users-error">{error}</div>}

      {loading ? (
        <div className="users-message">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="users-message">No users found.</div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th className="id-column">ID</th>
                <th className="name-column">Name</th>
                <th>Email</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="user-actions">
                      <button
                        type="button"
                        className="icon-button view-action"
                        title="View user"
                        aria-label={`View ${user.name}`}
                        onClick={() => setViewUser(user)}
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 5c-5.5 0-9.7 5.1-10 7 .3 1.9 4.5 7 10 7s9.7-5.1 10-7c-.3-1.9-4.5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="icon-button edit-action"
                        title="Edit user"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => openEditModal(user)}
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66zM5 19v-1l9.06-9.06 1 1L6 19H5z" />
                          <path d="M19 19H9v2h10a2 2 0 0 0 2-2V9h-2v10z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="icon-button delete-action"
                        title="Delete user"
                        aria-label={`Delete ${user.name}`}
                        onClick={() => void handleDelete(user.id)}
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
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
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-heading"
          >
            <h2 id="user-modal-heading" className="user-modal-title">
              {formData.id === 0 ? "Add User" : "Edit User"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="user-form-group">
                <label htmlFor="user-name">Name</label>
                <input
                  id="user-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="user-form-group">
                <label htmlFor="user-email">Email</label>
                <input
                  id="user-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="user-form-group">
                <label htmlFor="user-password">
                  Password
                  {formData.id !== 0 ? " (optional)" : ""}
                </label>
                <input
                  id="user-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    formData.id === 0
                      ? "Enter password"
                      : "Leave blank to keep current password"
                  }
                  required={formData.id === 0}
                  autoComplete="new-password"
                />
              </div>

              <div className="user-modal-actions">
                <button
                  type="button"
                  className="modal-button modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-button modal-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : formData.id === 0
                    ? "Add User"
                    : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewUser && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewUser(null);
            }
          }}
        >
          <div
            className="user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-user-heading"
          >
            <h2 id="view-user-heading" className="user-modal-title">
              User Details
            </h2>

            <div className="view-detail">
              <strong>ID:</strong> {viewUser.id}
            </div>

            <div className="view-detail">
              <strong>Name:</strong> {viewUser.name}
            </div>

            <div className="view-detail">
              <strong>Email:</strong> {viewUser.email}
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="modal-button modal-cancel"
                onClick={() => setViewUser(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="modal-button modal-save"
                onClick={() => openEditModal(viewUser)}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserForm;
