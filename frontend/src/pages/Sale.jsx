import { useEffect, useState } from "react";

const API_ITEMS = "http://localhost:3000/api/items/aggregated";
const API_SALE = "http://localhost:3000/api/items/sale";

export default function Sale() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    item_name: "",
    quantity: 1
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ITEMS ---------------- */

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(API_ITEMS);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- HANDLE SALE ---------------- */

  const submitSale = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.item_name) {
      setError("Please select an item");
      return;
    }

    const selected = items.find(i => i.item_name === form.item_name);

    if (!selected || form.quantity > selected.in_stock) {
      setError(
        `Not enough stock. Available: ${selected?.in_stock ?? 0}`
      );
      return;
    }

    const res = await fetch(`${API_SALE}/${form.item_name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: form.quantity })
    });

    if (!res.ok) {
      const text = await res.text();
      setError(text);
      return;
    }

    setMessage("Sale completed successfully");
    setForm({ item_name: "", quantity: 1 });
    fetchItems();
  };

  if (loading) {
    return <div>Loading sale page...</div>;
  }

  return (
    <>
      <h2 className="mb-4">Sale</h2>

      {/* FEEDBACK */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* SALE FORM */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Sell Item</h5>

          <form onSubmit={submitSale} className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Item</label>
              <select
                className="form-select"
                value={form.item_name}
                onChange={e =>
                  setForm({ ...form, item_name: e.target.value })
                }
              >
                <option value="">Select item</option>
                {items.map(item => (
                  <option key={item.item_name} value={item.item_name}>
                    {item.item_name} (In stock: {item.in_stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={form.quantity}
                onChange={e =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value)
                  })
                }
              />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-success w-100">
                Complete Sale
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* INVENTORY SNAPSHOT */}
      <div className="card">
        <div className="card-body">
          <h5>Current Inventory</h5>

          <table className="table table-bordered table-sm mt-3">
            <thead>
              <tr>
                <th>Item</th>
                <th>In Stock</th>
                <th>Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.item_name}>
                  <td>{item.item_name}</td>
                  <td>{item.in_stock}</td>
                  <td>{item.selling_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
