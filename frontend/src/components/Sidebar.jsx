import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">Inventory</h4>

      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/">
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/items">
            Items
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/sale">
            Sale
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/history">
            History
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
