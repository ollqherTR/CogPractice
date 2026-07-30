import { useEffect, useState } from "react";
import api from "../services/api";

function Services() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/customers");
        setCustomers(response.data || []);
      } catch (e) {
        setError("Unable to load customer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return (
    <section className="page-section services-page">
      <div className="container">
        <h1>Services</h1>
        <p>
          Customer account data is retrieved from the backend API and displayed
          in this table.
        </p>

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
                  <th>Number of Transactions</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No customers found.</td>
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
