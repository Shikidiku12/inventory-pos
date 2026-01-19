import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000/api/sale/history"; // via Vite proxy

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    item_name: "",
    from: "",
    to: ""
  });

  /* ---------------- FETCH HISTORY ---------------- */

  const fetchHistory = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.item_name) params.append("item_name", filters.item_name);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    const data = await res.json();

    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ---------------- FILTER SUBMIT ---------------- */

  const applyFilters = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <>
      <h2 className="mb-4">Inventory History</h2>

      {/* FILTERS */}
      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={applyFilters}>
            <div className="col-md-4">
              <label className="form-label">Item</label>
              <select
                className="form-select"
                value={filters.item_name}
                onChange={e =>
                  setFilters({ ...filters, item_name: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="battery">Battery</option>
                <option value="panel">Panel</option>
                <option value="tire">Tire</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">From (Date In)</label>
              <input
                type="date"
                className="form-control"
                value={filters.from}
                onChange={e =>
                  setFilters({ ...filters, from: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">To (Date In)</label>
              <input
                type="date"
                className="form-control"
                value={filters.to}
                onChange={e =>
                  setFilters({ ...filters, to: e.target.value })
                }
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="card">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Item</th>
                <th>Code</th>
                <th>Item #</th>
                <th>Date In</th>
                <th>Date Out</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Selling</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No records found
                  </td>
                </tr>
              )}

              {history.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.item_name}</td>
                  <td>{row.item_code}</td>
                  <td>{row.item_number}</td>
                  <td>{formatDate(row.date_in)}</td>
                  <td>{row.date_out ? formatDate(row.date_out) : "-"}</td>
                  <td>
                    {row.sold ? (
                      <span className="badge bg-success">SOLD</span>
                    ) : (
                      <span className="badge bg-secondary">IN STOCK</span>
                    )}
                  </td>
                  <td>{row.cost}</td>
                  <td>{row.selling_price}</td>
                  <td>{row.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------------- HELPERS ---------------- */

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}
