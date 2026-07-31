import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Services() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    checkingBalance: 0,
    savingsBalance: 0,
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true, state: { from: "/services" } });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/api/v1/customers");
        setCustomers(response.data || []);
      } catch (e) {
        const status = e.response?.status;
        const message = e.response?.data?.message;

        if (status === 401) {
          navigate("/login", { replace: true, state: { from: "/services" } });
        } else {
          setError(
            message || "Unable to load customer data. Please try again later.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [navigate]);

  const resetForm = () => {
    setFormState({
      username: "",
      password: "",
      checkingBalance: 0,
      savingsBalance: 0,
    });
    setEditCustomer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name.includes("Balance") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editCustomer) {
      if (!formState.username.trim()) {
        setError("Username is required to create a customer.");
        return;
      }
      if (!formState.password.trim()) {
        setError("Password is required to create a customer.");
        return;
      }
    }

    setSaving(true);

    try {
      if (editCustomer) {
        await api.put(`/api/v1/customers/${editCustomer.username}`, {
          password: formState.password || undefined,
          checkingBalance: formState.checkingBalance,
          savingsBalance: formState.savingsBalance,
        });
      } else {
        await api.post("/api/v1/customers", {
          username: formState.username,
          password: formState.password,
          checkingBalance: formState.checkingBalance,
          savingsBalance: formState.savingsBalance,
        });
      }

      const refreshed = await api.get("/api/v1/customers");
      setCustomers(refreshed.data || []);
      resetForm();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to save customer. Please try again later.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setFormState({
      username: customer.username,
      password: "",
      checkingBalance: customer.checkingBalance || 0,
      savingsBalance: customer.savingsBalance || 0,
    });
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete customer ${customer.username}?`)) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.delete(`/api/v1/customers/${customer.username}`);
      const refreshed = await api.get("/api/v1/customers");
      setCustomers(refreshed.data || []);
      if (editCustomer?.username === customer.username) {
        resetForm();
      }
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to delete customer. Please try again later.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-section services-page">
      <div className="container">
        <h1>Services</h1>
        <p>
          Manage customers here. Create a new customer or edit existing customer
          balances.
        </p>

        <div className="form-section">
          <h2>{editCustomer ? "Edit Customer" : "Add Customer"}</h2>
          <form className="customer-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={formState.username}
                onChange={handleChange}
                placeholder="Username"
                disabled={!!editCustomer}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder={
                  editCustomer ? "Leave blank to keep password" : "Password"
                }
              />
            </label>
            <label>
              Checking Balance
              <input
                type="number"
                name="checkingBalance"
                value={formState.checkingBalance}
                onChange={handleChange}
              />
            </label>
            <label>
              Savings Balance
              <input
                type="number"
                name="savingsBalance"
                value={formState.savingsBalance}
                onChange={handleChange}
              />
            </label>
            <div className="form-actions">
              <button
                type="submit"
                className="button-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editCustomer
                    ? "Update Customer"
                    : "Create Customer"}
              </button>
              {editCustomer && (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {loading && <p className="status-message">Loading customers...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Checking Balance</th>
                  <th>Savings Balance</th>
                  <th>Transactions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.username}>
                      <td>{customer.username}</td>
                      <td>{customer.checkingBalance ?? "-"}</td>
                      <td>{customer.savingsBalance ?? "-"}</td>
                      <td>{customer.transactions?.length ?? 0}</td>
                      <td>
                        <button
                          className="button-secondary"
                          onClick={() => handleEdit(customer)}
                        >
                          Edit
                        </button>
                        <button
                          className="button-secondary"
                          onClick={() => handleDelete(customer)}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
