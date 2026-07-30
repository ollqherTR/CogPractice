function Home() {
  return (
    <section className="page-section home-page">
      <div className="container">
        <div className="page-heading">
          <h1>Modern Bank Dashboard</h1>
          <p>
            A clean React frontend for your Express + MongoDB bank API. Access
            customer data, login, and register for secured usage.
          </p>
        </div>
        <div className="hero-grid">
          <div className="hero-card">
            <h2>Secure Authentication</h2>
            <p>Register and login safely with JWT-based authentication.</p>
          </div>
          <div className="hero-card">
            <h2>Customer Services</h2>
            <p>View and manage customer records with friendly table layouts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
