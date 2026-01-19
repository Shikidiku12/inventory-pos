import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000/api/items"; // using Vite proxy

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addForm, setAddForm] = useState({
    item_name: "battery",
    quantity: 1
  });

  const [configForm, setConfigForm] = useState({
    item_name: "battery",
    item_code: "",
    price: "",
    selling_price: ""
  });

  /* ---------------- FETCH ITEMS ---------------- */

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/aggregated`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- ADD STOCK ---------------- */

  const addStock = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm)
    });

    fetchItems();
  };

  /* ---------------- UPDATE CONFIG ---------------- */

  const updateConfig = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/config/${configForm.item_name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configForm)
    });

    fetchItems();
  };

  if (loading) {
    return <div>Loading items...</div>;
  }

  return (
    <>
      <h2 className="mb-4">Items</h2>

      {/* INVENTORY TABLE */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Inventory</h5>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Item</th>
                <th>Code</th>
                <th>Cost</th>
                <th>Selling</th>
                <th>In Stock</th>
                <th>Sold</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.item_name}>
                  <td>{item.item_name}</td>
                  <td>{item.item_code}</td>
                  <td>{item.price}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.in_stock}</td>
                  <td>{item.sold}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row">
        {/* ADD STOCK */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5>Add Stock</h5>

              <form onSubmit={addStock}>
                <select
                  className="form-select mb-2"
                  value={addForm.item_name}
                  onChange={e =>
                    setAddForm({ ...addForm, item_name: e.target.value })
                  }
                >
                  <option value="battery">Battery</option>
                  <option value="panel">Panel</option>
                  <option value="tire">Tire</option>
                </select>

                <input
                  type="number"
                  min="1"
                  className="form-control mb-2"
                  placeholder="Quantity"
                  value={addForm.quantity}
                  onChange={e =>
                    setAddForm({ ...addForm, quantity: Number(e.target.value) })
                  }
                />

                <button className="btn btn-primary w-100">
                  Add Stock
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* UPDATE CONFIG */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5>Update Item Config</h5>

              <form onSubmit={updateConfig}>
                <select
                  className="form-select mb-2"
                  value={configForm.item_name}
                  onChange={e =>
                    setConfigForm({ ...configForm, item_name: e.target.value })
                  }
                >
                  <option value="battery">Battery</option>
                  <option value="panel">Panel</option>
                  <option value="tire">Tire</option>
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Item Code"
                  value={configForm.item_code}
                  onChange={e =>
                    setConfigForm({ ...configForm, item_code: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Cost Price"
                  value={configForm.price}
                  onChange={e =>
                    setConfigForm({ ...configForm, price: Number(e.target.value) })
                  }
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Selling Price"
                  value={configForm.selling_price}
                  onChange={e =>
                    setConfigForm({
                      ...configForm,
                      selling_price: Number(e.target.value)
                    })
                  }
                />

                <button className="btn btn-warning w-100">
                  Update Config
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}