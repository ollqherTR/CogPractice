import { useState } from "react";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter a valid username and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", {
        username,
        password,
      });

      setMessage(response.data.message || "Registration successful.");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section auth-page">
      <div className="container small-container">
        <div className="page-heading">
          <h1>Register</h1>
          <p>Create a new account to access the bank dashboard.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        {message && (
          <p className="status-message auth-message success">{message}</p>
        )}
        {error && <p className="status-message auth-message error">{error}</p>}
      </div>
    </section>
  );
}

export default Register;
