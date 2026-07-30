import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("Please enter username and password.");
      return;
    }

    setMessage(`Welcome, ${username}! Login successful.`);
  };

  return (
    <section className="page-section login-page">
      <div className="container">
        <h1>Login</h1>
        <p>
          This page is for demo purposes only. There is no real authentication
          with the backend.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        {message && <p className="status-message login-message">{message}</p>}
      </div>
    </section>
  );
}

export default Login;
